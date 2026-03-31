<?php

test('returns a successful response', function () {
    $response = $this->get(route('hero'));

    $response->assertOk();
});
