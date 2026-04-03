<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kill;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KillController extends Controller
{
    public function index(): Response
    {
        $kills = Kill::with([
            'killer:id,name',
            'victim:id,name',
        ])->latest()->get();

        return Inertia::render('admin/kills', [
            'kills' => $kills,
        ]);
    }

    public function dismiss(Kill $kill): RedirectResponse
    {
        $kill->update([
            'contested' => false,
            'approved' => true,
        ]);

        return back();
    }

    public function revert(Kill $kill): RedirectResponse
    {
        $victim = $kill->victim;
        $killer = $kill->killer;

        $victim->alive = true;
        $victim->killed_by = null;
        $victim->current_target_id = $kill->victim_prev_target_id;
        $victim->save();

        $killer->current_target_id = $victim->id;
        $killer->total_kills -= 1;
        $killer->save();

        $kill->delete();

        return back();
    }
}
