<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TargetRule;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $players = User::query()
            ->with(['currentTarget:id,name,nickname', 'killedByUser:id,name,nickname'])
            ->orderBy('name')
            ->get();

        $targetRules = TargetRule::query()
            ->with(['player1:id,name', 'player2:id,name'])
            ->get();

        return Inertia::render('admin/players', [
            'players' => $players,
            'targetRules' => $targetRules,
        ]);
    }
}
