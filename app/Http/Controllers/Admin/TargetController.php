<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTargetRuleRequest;
use App\Models\TargetRule;
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
}
