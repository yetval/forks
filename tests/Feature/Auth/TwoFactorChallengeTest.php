<?php

use Illuminate\Support\Facades\Route;

test('two factor challenge routes are not registered', function () {
    expect(Route::has('two-factor.login'))->toBeFalse();
    expect(Route::has('two-factor.login.store'))->toBeFalse();
});

test('login screen does not mention two factor authentication', function () {
    $this->get(route('login'))
        ->assertDontSee('two-factor', false)
        ->assertDontSee('authenticator', false);
});
