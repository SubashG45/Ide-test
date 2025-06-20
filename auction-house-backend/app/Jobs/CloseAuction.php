<?php

namespace App\Jobs;

use App\Events\AuctionClosed;
use App\Models\Auction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class CloseAuction implements ShouldQueue
{
    use Queueable;

    protected Auction $auction;

    /**
     * Create a new job instance.
     */
    public function __construct(Auction $auction)
    {
        $this->auction = $auction;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        if (!$this->auction->is_active) return;

        $this->auction->update(['is_active' => false]);

        $winner = $this->auction->bids()->orderByDesc('amount')->first();

        if ($winner) {
            $this->auction->update([
                'winner_name' => $winner->bidder_name,
                'winning_bid_amount' => $winner->amount
            ]);
        }

        // $prefix = config('database.redis.options.prefix');
        // Log::info("Prefix", ['Yo' => $prefix]);
        $allKeys = Redis::keys("auction_started:*");
        // Log::info("All keys", ['keys' => $allKeys]);

        if (!empty($allKeys)) {
            // Redis::del(...$allKeys);
            // foreach($allKeys as $key) {
            //     Log::info("k ho", ["keys" => $key]);
            //     Redis::del($key);
            // }
            Redis::flushDb();
            // Log::info("Deleted auction_started keys", ['keys' => $allKeys]);
        }

        event(new AuctionClosed($this->auction, $winner));

        Artisan::call('auction:start');
    }
}
