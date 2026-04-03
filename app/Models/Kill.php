<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kill extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'killer_id',
        'victim_id',
        'victim_prev_target_id',
        'approved',
        'contested',
        'contest_reason',
        'is_ffa',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'approved' => 'boolean',
            'contested' => 'boolean',
            'is_ffa' => 'boolean',
        ];
    }

    public function killer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'killer_id');
    }

    public function victim(): BelongsTo
    {
        return $this->belongsTo(User::class, 'victim_id');
    }

    public function victimPrevTarget(): BelongsTo
    {
        return $this->belongsTo(User::class, 'victim_prev_target_id');
    }
}
