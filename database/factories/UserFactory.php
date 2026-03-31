<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'google_id' => (string) fake()->unique()->numberBetween(10000, 99999),
            'email' => fake()->unique()->safeEmail(),
            'nickname' => fake()->userName(),
            'phone' => fake()->phoneNumber(),
            'dorm_location' => fake()->randomElement([
                '1st South', '2nd South', '3rd South', '4th South',
                '2nd North', '3rd North', '4th North', '5th North',
            ]),
            'grade_year' => fake()->randomElement(['junior', 'senior']),
            'profile_completed' => false,
            'is_admin' => false,
            'alive' => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
        ]);
    }

    public function profileCompleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'profile_completed' => true,
        ]);
    }
}
