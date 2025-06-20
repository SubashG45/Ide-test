<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    protected $fillable = [
        'auction_id',
        'bidder_name',
        'amount'
    ];

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }
}
