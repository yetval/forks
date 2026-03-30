<?php

use Illuminate\Support\Facades\Route;

test('password settings routes are not registered', function () {
    expect(Route::has('user-password.edit'))->toBeFalse();
    expect(Route::has('user-password.update'))->toBeFalse();
});

test('settings page only exposes the profile route', function () {
    expect(Route::has('profile.edit'))->toBeTrue();
    expect(Route::has('profile.update'))->toBeTrue();
});
