<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTargetRuleRequest;
use App\Models\TargetRule;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class TargetController extends Controller
{
    public function store(StoreTargetRuleRequest $request): RedirectResponse
    {
        TargetRule::create($request->validated());

        return back();
    }

    public function destroy(TargetRule $targetRule): RedirectResponse
    {
        $targetRule->delete();

        return back();
    }

    public function assignTargets(): RedirectResponse
    {
        $players = User::query()
            ->where('is_admin', false)
            ->get()
            ->shuffle()
            ->values();

        if ($players->count() < 2) {
            return back();
        }

        $targetRules = TargetRule::all();

        $targetRules->each(function ($targetRule) use (&$players) {
            $player1Index = $players->search(fn ($p) => $p->id === $targetRule->player_1);
            $removedPlayer = $players->pull($player1Index);
            $players = $players->values();

            $player2Index = $players->search(fn ($p) => $p->id === $targetRule->player_2);
            $players->splice($player2Index, 0, [$removedPlayer]);
        });

        $players->each(function ($player, $index) use ($players) {
            $player->current_target_id = $players[($index + 1) % $players->count()]->id;
            $player->save();
        });

        return back();
    }

    public function clearTargets(): RedirectResponse
    {
        User::query()->update(['current_target_id' => null]);

        return back();
    }
}
