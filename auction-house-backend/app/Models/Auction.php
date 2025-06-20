<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auction extends Model
{
    protected $fillable = [
        'ends_at',
        'is_active',
        'winner_name',
        'winning_bid_amount',
    ];

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }
}
