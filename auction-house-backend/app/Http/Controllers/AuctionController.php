<?php

namespace App\Http\Controllers;

use App\Events\BidPlaced;
use App\Models\Auction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuctionController extends Controller
{
    public function placeBid(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'bidder_name' => 'required|string'
        ]);

        $auction = Auction::where('is_active', true)->firstOrFail();

        $highest = $auction->bids()->orderByDesc('amount')->first();

        if ($highest && $request->amount <= $highest->amount) {
            return response()->json(['error' => 'Bid must be higher than current.'], 400);
        }

        $bid = $auction->bids()->create([
            'bidder_name' => $request->bidder_name,
            'amount' => $request->amount
        ]);

        $startKey = "auction_started:{$auction->id}";
        $current = Redis::get($startKey);
        $data = $current ? json_decode($current, true) : [];

        $data['amount'] = $request->amount;
        $data['bidder_name'] = $request->bidder_name;

        Redis::set($startKey, json_encode($data));

        event(new BidPlaced($bid));

        return response()->json(['success' => true]);
    }

    public function stream()
    {
        $auction = Auction::where('is_active', true)->firstOrFail();
        $id = $auction->id;

        $response = new StreamedResponse(function () use ($id) {
            $key = "auction_started:{$id}";
            $lastData = null;
            $lastHeartbeat = time();

            echo "retry: 3000\n\n";
            ob_flush();
            flush();

            while (true) {
                $current = Redis::get($key);

                if ($current && $current !== $lastData) {
                    $lastData = $current;

                    echo "event: message\n";
                    echo "data: {$current}\n\n";
                    ob_flush();
                    flush();
                }
                if (time() - $lastHeartbeat >= 5) {
                    echo "event: heartbeat\n";
                    echo "data: {}\n\n";
                    ob_flush();
                    flush();
                    $lastHeartbeat = time();
                }

                if (connection_aborted()) {
                    break;
                }

                // Sleep 200ms to reduce CPU usage
                usleep(200000);
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }
}
