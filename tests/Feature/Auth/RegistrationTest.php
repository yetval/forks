<?php

use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/register')
        );
});

test('local registration route is not registered', function () {
    expect(Route::has('register.store'))->toBeFalse();
    expect(Route::has('auth.google'))->toBeTrue();
});
