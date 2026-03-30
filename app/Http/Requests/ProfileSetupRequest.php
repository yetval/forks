<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileSetupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nickname' => ['required', 'string', 'max:50'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'dorm_location' => ['required', 'string', Rule::in([
                '1st South',
                '2nd South',
                '3rd South',
                '4th South',
                '2nd North',
                '3rd North',
                '4th North',
                '5th North',
            ])],
            'grade_year' => ['required', 'string', Rule::in(['Junior', 'Senior'])],
        ];
    }
}
