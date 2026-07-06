<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'category' => fake()->randomElement(['consultation', 'procedure', 'administration', 'lab']),
            'icd9cm_code' => fake()->regexify('\d{2}(\.\d{1,2})?'),
            'price' => fake()->numberBetween(50000, 500000) * 100,
            'is_active' => true,
        ];
    }
}
