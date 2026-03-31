<?php

use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
    return Inertia::render('hero');
})->name('hero');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'profile.completed'])->name('dashboard');

Route::get('/login', function () {
    return Inertia::render('auth/login', [
        'status' => session('status'),
    ]);
})->middleware('guest')->name('login');

Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return to_route('hero');
})->middleware('auth')->name('logout');

Route::get('/register', function () {
    return to_route('login');
})->middleware('guest')->name('register');

Route::get('/auth/google', function () {
    return Socialite::driver('google')->redirect();
})->name('auth.google');

Route::get('/auth/google/callback', function () {
    $game = Game::current();
    $googleUser = Socialite::driver('google')->user();

    if (! $game->authIsOpen()) {
        return to_route('login')->with('status', 'Logins are currently closed.');
    }

    $user = User::query()
        ->where('google_id', $googleUser->getId())
        ->orWhere('email', $googleUser->getEmail())
        ->first();

    if ($user) {
        $user->update([
            'google_id' => $googleUser->getId(),
            'name' => $googleUser->getName() ?: $user->name,
            'email' => $googleUser->getEmail() ?: $user->email,
        ]);
    } else {
        $user = User::create([
            'google_id' => $googleUser->getId(),
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
        ]);
    }

    Auth::login($user);

    return redirect('/dashboard');
})->name('auth.google.callback');

require __DIR__.'/settings.php';
