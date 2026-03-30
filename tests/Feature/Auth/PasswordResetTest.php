<?php

use Illuminate\Support\Facades\Route;

test('password reset routes are not registered', function () {
    expect(Route::has('password.request'))->toBeFalse();
    expect(Route::has('password.email'))->toBeFalse();
    expect(Route::has('password.reset'))->toBeFalse();
    expect(Route::has('password.update'))->toBeFalse();
});

test('local password reset ui is not part of the auth screens', function () {
    $this->get(route('login'))
        ->assertDontSee('Forgot password');
});
