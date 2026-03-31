<?php

namespace App\Models;

use App\Enums\GameStage;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'stage',
        'auth_open',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stage' => GameStage::class,
            'auth_open' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return static::query()->first() ?? static::query()->create(static::defaultAttributes());
    }

    /**
     * @return array<string, GameStage|bool>
     */
    public static function defaultAttributes(): array
    {
        return [
            'stage' => GameStage::Pregame,
            'auth_open' => false,
        ];
    }

    public function authIsOpen(): bool
    {
        return $this->auth_open;
    }
}
