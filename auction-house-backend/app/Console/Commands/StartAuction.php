<?php

namespace App\Console\Commands;

use App\Events\AuctionStarted;
use App\Jobs\CloseAuction;
use App\Models\Auction;
use Illuminate\Console\Command;

class StartAuction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auction:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Close previous if still open
        Auction::where('is_active', true)->update(['is_active' => false]);

        $auction = Auction::create([
            'ends_at' => now()->addMinutes(30),
            'is_active' => true
        ]);

        event(new AuctionStarted($auction));

        // Schedule auto-close
        CloseAuction::dispatch($auction)->delay($auction->ends_at);

        $this->info("New auction started: #{$auction->id}");
    }
}
