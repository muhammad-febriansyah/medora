<?php

namespace Database\Factories;

use App\Models\Medicine;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Medicine>
 */
class MedicineFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'generic_name' => fake()->word(),
            'unit' => fake()->randomElement(['tablet', 'kapsul', 'botol', 'sachet', 'ampul']),
            'dosage_form' => fake()->randomElement(['tablet', 'sirup', 'injeksi', 'salep']),
            'selling_price' => fake()->numberBetween(1000, 100000) * 100,
            'stock_quantity' => fake()->numberBetween(0, 500),
            'minimum_stock' => fake()->numberBetween(10, 50),
            'is_active' => true,
        ];
    }
}
