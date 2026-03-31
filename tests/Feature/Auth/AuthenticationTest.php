<?php

use App\Enums\GameStage;
use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Socialite\Facades\Socialite;

test('login screen can be rendered', function () {

    $response = $this->get(route('login'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('game.auth_open', false)
        );
});

test('login screen reflects closed auth', function () {
    Game::current()->update(['stage' => GameStage::Running, 'auth_open' => false]);

    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('game.stage', GameStage::Running->value)
            ->where('game.auth_open', false)
        );
});

test('login screen links guests into the google auth flow', function () {
    expect(Route::has('auth.google'))->toBeTrue();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $this->assertGuest();
    $response->assertRedirect(route('hero'));
});

test('no one can sign in through google when auth is closed', function () {
    Game::current()->update(['stage' => GameStage::Running, 'auth_open' => false]);

    $googleUser = new class
    {
        public function getId(): string
        {
            return 'google-123';
        }

        public function getName(): string
        {
            return 'Some User';
        }

        public function getEmail(): string
        {
            return 'someone@example.com';
        }
    };

    Socialite::shouldReceive('driver->user')->once()->andReturn($googleUser);

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('login'));

    $this->assertGuest();
});

test('existing users can sign in through google when auth is open', function () {
    Game::current()->update(['stage' => GameStage::Running, 'auth_open' => true]);

    $user = User::factory()->create([
        'google_id' => 'existing-google-id',
        'email' => 'existing@example.com',
        'profile_completed' => true,
    ]);

    $googleUser = new class
    {
        public function getId(): string
        {
            return 'existing-google-id';
        }

        public function getName(): string
        {
            return 'Existing User';
        }

        public function getEmail(): string
        {
            return 'existing@example.com';
        }
    };

    Socialite::shouldReceive('driver->user')->once()->andReturn($googleUser);

    $this->get(route('auth.google.callback'))
        ->assertRedirect('/dashboard');

    $this->assertAuthenticatedAs($user->refresh());
});
