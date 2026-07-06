<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'medical_record_number' => fake()->unique()->numerify('RM######'),
            'nik' => fake()->optional(0.7)->numerify('################'),
            'name' => fake()->name(),
            'birth_date' => fake()->dateTimeBetween('-90 years', '-1 year')->format('Y-m-d'),
            'birth_place' => fake()->city(),
            'gender' => fake()->randomElement(['male', 'female']),
            'address' => fake()->address(),
            'phone' => fake()->numerify('08##########'),
            'blood_type' => fake()->randomElement(['A', 'B', 'AB', 'O']),
            'occupation' => fake()->jobTitle(),
        ];
    }
}
