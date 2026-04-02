<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateGameRequest;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function index(): Response
    {
        $total = User::query()->count();
        $alive = User::query()->where('alive', true)->count();

        return Inertia::render('admin/game', [
            'stats' => [
                'total' => $total,
                'alive' => $alive,
                'dead' => $total - $alive,
            ],
        ]);
    }

    public function update(UpdateGameRequest $request): RedirectResponse
    {
        Game::current()->update($request->validated());

        return to_route('game');
    }
}
