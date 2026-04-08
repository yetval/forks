<?php

return [
    'admin_emails' => array_filter(explode(',', env('ADMIN_EMAILS', ''))),
    'start' => env('GAME_START', '2026-04-13T00:00:00'),
];
