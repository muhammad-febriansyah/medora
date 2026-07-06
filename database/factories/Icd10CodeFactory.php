<?php

namespace Database\Factories;

use App\Models\Icd10Code;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Icd10Code>
 */
class Icd10CodeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => fake()->regexify('[A-Z]\d{2}(\.\d{1,2})?'),
            'description_en' => fake()->sentence(3),
            'description_id' => fake()->sentence(3),
        ];
    }
}
