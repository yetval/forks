<?php

return [
    'admin_emails' => array_filter(explode(',', env('ADMIN_EMAILS', ''))),
];
