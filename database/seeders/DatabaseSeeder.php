<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            MasterDataSeeder::class,
        ]);

        $admin = User::factory()->create([
            'name' => 'Admin Medora',
            'email' => 'admin@medora.id',
            'password' => Hash::make('password'),
        ]);

        $admin->assignRole('admin');

        \App\Models\Clinic::firstOrCreate([], [
            'name' => 'Klinik Medora',
            'address' => 'Jl. Kesehatan No. 123, Jakarta',
            'phone' => '021-12345678',
            'license_number' => 'SIK/123/2024',
            'opening_hours' => 'Senin-Sabtu, 08.00-21.00 WIB',
        ]);
    }
}
