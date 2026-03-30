<?php

use App\Http\Controllers\ProfileSetupController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Socialite\Socialite;

Route::middleware(['auth'])->group(function () {
    Route::get('profile-setup', [ProfileSetupController::class, 'create'])
        ->name('profile.setup');
    Route::post('profile-setup', [ProfileSetupController::class, 'store'])
        ->name('profile.setup.store');
});

Route::get('/home', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/', function () {
    return Inertia::render('hero');
})->name('hero');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified', 'profile.completed'])->name('dashboard');

Route::get('/register', function () {
    return Inertia::render('auth/register');
})->middleware('guest')->name('register');

Route::get('/auth/google', function () {
    return Socialite::driver('google')->redirect();
})->name('auth.google');

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();

    $user = User::firstOrCreate(
        ['google_id' => $googleUser->getId()],
        [
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
        ],
    );

    Auth::login($user);

    return redirect('/dashboard');
})->name('auth.google.callback');

require __DIR__.'/settings.php';
