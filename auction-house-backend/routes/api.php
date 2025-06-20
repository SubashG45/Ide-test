<?php

use App\Http\Controllers\AuctionController;
use Illuminate\Support\Facades\Route;


Route::post('/bids', [AuctionController::class, 'placeBid']);
Route::get('/stream', [AuctionController::class, 'stream']);