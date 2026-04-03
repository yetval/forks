<?php

namespace App\Http\Requests\Admin;

use App\Enums\GameStage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGameRequest extends FormRequest
{
    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'stage' => ['sometimes', 'required', Rule::enum(GameStage::class)],
            'auth_open' => ['sometimes', 'required', 'boolean'],
            'show_real_names' => ['sometimes', 'required', 'boolean'],
        ];
    }
}
