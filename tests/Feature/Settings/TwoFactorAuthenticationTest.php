<?php

use Illuminate\Support\Facades\Route;

test('two factor settings route is not registered', function () {
    expect(Route::has('two-factor.show'))->toBeFalse();
});

test('settings no longer contains extra security sub-pages', function () {
    expect(Route::has('two-factor.show'))->toBeFalse();
    expect(Route::has('user-password.edit'))->toBeFalse();
});
