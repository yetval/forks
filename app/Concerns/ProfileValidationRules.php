<?php

namespace App\Concerns;

use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'nickname' => ['required', 'string', 'max:50'],
            'phone' => ['required', 'string', 'max:20'],
            'dorm_location' => ['required', 'string', Rule::in($this->dormLocations())],
            'grade_year' => ['required', 'string', Rule::in($this->gradeYears())],
        ];
    }

    /**
     * Get the supported dorm locations.
     *
     * @return list<string>
     */
    protected function dormLocations(): array
    {
        return [
            '1st South',
            '2nd South',
            '3rd South',
            '4th South',
            '2nd North',
            '3rd North',
            '4th North',
            '5th North',
        ];
    }

    /**
     * Get the supported grade years.
     *
     * @return list<string>
     */
    protected function gradeYears(): array
    {
        return ['Junior', 'Senior'];
    }
}
