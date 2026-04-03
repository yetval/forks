<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTargetRuleRequest extends FormRequest
{
    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'player_1' => ['required', 'exists:users,id'],
            'player_2' => ['required', 'exists:users,id', 'different:player_1'],
        ];
    }
}
