<?php

namespace App\Enums;

enum GameStage: string
{
    case Pregame = 'pregame';
    case Running = 'running';
    case Postgame = 'postgame';

    public function label(): string
    {
        return match ($this) {
            self::Pregame => 'Pregame',
            self::Running => 'Running',
            self::Postgame => 'Postgame',
        };
    }
}
