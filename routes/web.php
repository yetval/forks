<?php

use App\Http\Controllers\Admin\GameController;
use App\Http\Controllers\Admin\TargetController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\KillController;
use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
    return Inertia::render('hero');
})->name('hero');

Route::middleware(['auth', 'profile.completed'])->group(function () {
    Route::get('dashboard', [KillController::class, 'index'])->name('dashboard');
    Route::post('/kill', [KillController::class, 'store'])->name('kill.store');
    Route::post('/kill/approve', [KillController::class, 'approve'])->name('kill.approve');
    Route::post('/kill/contest', [KillController::class, 'contest'])->name('kill.contest');
});

Route::prefix('admin')->middleware(['auth', 'profile.completed', 'admin'])->group(function () {
    Route::get('/players', [UserController::class, 'index'])->name('players');
    Route::get('/game', [GameController::class, 'index'])->name('game');
    Route::post('/game', [GameController::class, 'update'])->name('game.update');
    Route::post('/target-rules', [TargetController::class, 'store'])->name('target-rules.store');
    Route::delete('/target-rules/{targetRule}', [TargetController::class, 'destroy'])->name('target-rules.destroy');
    Route::post('/targets/assign', [TargetController::class, 'assignTargets'])->name('targets.assign');
    Route::post('/targets/clear', [TargetController::class, 'clearTargets'])->name('targets.clear');
});

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

    $isAdmin = in_array($googleUser->getEmail(), config('game.admin_emails'));

    if ($user) {
        $user->update([
            'google_id' => $googleUser->getId(),
            'name' => $googleUser->getName() ?: $user->name,
            'email' => $googleUser->getEmail() ?: $user->email,
            'is_admin' => $isAdmin,
        ]);
    } else {
        $user = User::create([
            'google_id' => $googleUser->getId(),
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'is_admin' => $isAdmin,
        ]);
    }

    Auth::login($user);

    return redirect('/dashboard');
})->name('auth.google.callback');

require __DIR__.'/settings.php';
