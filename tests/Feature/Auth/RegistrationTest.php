<?php

use Illuminate\Support\Facades\Route;

test('registration route redirects to the login screen', function () {
    $this->get(route('register'))
        ->assertRedirect(route('login'));
});

test('local registration route is not registered', function () {
    expect(Route::has('register.store'))->toBeFalse();
    expect(Route::has('auth.google'))->toBeTrue();
});
