<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'isProfileComplete' => $request->user()->profile_completed,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $wasProfileComplete = $user->profile_completed;

        $user->update([
            ...$request->validated(),
            'profile_completed' => true,
        ]);

        if (! $wasProfileComplete) {
            return to_route('dashboard');
        }

        return to_route('profile.edit');
    }
}
