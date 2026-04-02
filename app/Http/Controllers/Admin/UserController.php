<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

        return Inertia::render('admin/players', [
            'players' => $players,
        ]);
    }
}
