<?php

namespace App\Events;

use App\Models\Auction;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Support\Facades\Redis;

class AuctionStarted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Auction $auction;

    /**
     * Create a new event instance.
     */
    public function __construct(Auction $auction)
    {
        $this->auction = $auction;

        // Push event payload to Redis (for manual SSE)
        $startKey = "auction_started:{$auction->id}";
        Redis::set($startKey, json_encode([
            'type' => 'auction_started',
            'auctionId' => $auction->id,
            'active' => true,
            'endsAt' => $auction->ends_at->toIso8601String(),
        ]));
    }
}
