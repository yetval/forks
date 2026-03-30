<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileSetupRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileSetupController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()->profile_completed) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('profile-setup');
    }

    public function store(ProfileSetupRequest $request): RedirectResponse
    {
        $request->user()->update([
            ...$request->validated(),
            'profile_completed' => true,
        ]);

        return to_route('dashboard');
    }
}
