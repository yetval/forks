<?php

namespace App\Http\Controllers;

use App\Enums\GameStage;
use App\Models\Game;
use App\Models\Kill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class KillController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user()->load(['currentTarget:id,name,nickname', 'killedByUser:id,name,nickname']);

        $kill = null;
        if (! $user->alive) {
            $kill = Kill::with('killer:id,name,nickname')->where('victim_id', $user->id)->first();
        }

        return Inertia::render('targets', [
            'target' => $user->currentTarget,
            'kill' => $kill,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'verification_name' => ['required', 'string'],
        ]);

        $game = Game::current();
        if ($game->stage !== GameStage::Running) {
            return back()->withErrors(['verification_name' => 'The game is not running.']);
        }

        $killer = Auth::user();
        if (! $killer->alive) {
            return back()->withErrors(['verification_name' => 'You are already eliminated.']);
        }

        $victim = $killer->currentTarget;
        if (! $victim) {
            return back()->withErrors(['verification_name' => 'You have no target assigned.']);
        }

        $victimsTarget = $victim->currentTarget;
        if (! $victimsTarget) {
            return back()->withErrors(['verification_name' => 'Could not verify — target has no next target.']);
        }

        if (strtolower(trim($request->verification_name)) !== strtolower(trim($victimsTarget->name))) {
            return back()->withErrors(['verification_name' => 'Incorrect verification name.']);
        }

        $killer->current_target_id = $victim->current_target_id;
        $killer->total_kills += 1;
        $killer->save();

        $victim->alive = false;
        $victim->killed_by = $killer->id;
        $victim->current_target_id = null;
        $victim->save();

        Kill::create([
            'killer_id' => $killer->id,
            'victim_id' => $victim->id,
            'victim_prev_target_id' => $victimsTarget->id,
        ]);

        return back();
    }

    public function approve(): RedirectResponse
    {
        $user = Auth::user();
        if ($user->alive) {
            return back();
        }

        $kill = Kill::where('victim_id', $user->id)->firstOrFail();

        if ($kill->contested) {
            return back()->withErrors(['kill' => 'Your kill has been contested and is pending admin review.']);
        }

        $kill->update(['approved' => true]);

        return back();
    }

    public function contest(Request $request): RedirectResponse
    {
        $request->validate([
            'contest_reason' => ['required', 'string', 'max:1000'],
        ]);

        $user = Auth::user();
        if ($user->alive) {
            return back();
        }

        $kill = Kill::where('victim_id', $user->id)->firstOrFail();

        if ($kill->approved) {
            return back()->withErrors(['contest_reason' => 'You have already approved this kill.']);
        }

        $kill->update([
            'contested' => true,
            'contest_reason' => $request->contest_reason,
        ]);

        return back();
    }
}
