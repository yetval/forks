<?php

use Illuminate\Support\Facades\Route;

test('account deletion route is not registered', function () {
    expect(Route::has('profile.destroy'))->toBeFalse();
});
