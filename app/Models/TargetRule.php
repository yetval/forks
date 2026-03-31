<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TargetRule extends Model
{
    protected $fillable = [
        'player_1',
        'player_2',
    ];

    public function player1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'player_1');
    }

    public function player2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'player_2');
    }
}
