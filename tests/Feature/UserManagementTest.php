<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function adminUser(): User
{
    return User::factory()->create()->assignRole('admin');
}

function pendaftaranUser(): User
{
    return User::factory()->create()->assignRole('pendaftaran');
}

it('allows admin to view users index', function () {
    $this->actingAs(adminUser())
        ->get('/users')
        ->assertOk();
});

it('prevents non-admin from viewing users index', function () {
    $this->actingAs(pendaftaranUser())
        ->get('/users')
        ->assertForbidden();
});

it('allows admin to create a user', function () {
    $this->actingAs(adminUser())
        ->post('/users', [
            'name' => 'New User',
            'email' => 'new@medora.id',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles' => ['perawat'],
        ])
        ->assertRedirect('/users');

    expect(User::where('email', 'new@medora.id')->exists())->toBeTrue();
});

it('allows admin to update a user', function () {
    $user = User::factory()->create(['name' => 'Old Name']);
    $user->assignRole('perawat');

    $this->actingAs(adminUser())
        ->put("/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => $user->email,
            'is_active' => true,
            'roles' => ['dokter'],
        ])
        ->assertRedirect('/users');

    expect($user->fresh()->name)->toBe('Updated Name');
    expect($user->fresh()->hasRole('dokter'))->toBeTrue();
    expect($user->fresh()->hasRole('perawat'))->toBeFalse();
});

it('allows admin to soft delete a user', function () {
    $target = User::factory()->create();

    $this->actingAs(adminUser())
        ->delete("/users/{$target->id}")
        ->assertRedirect('/users');

    expect($target->fresh()->deleted_at)->not->toBeNull();
});

it('prevents admin from deleting self', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->delete("/users/{$admin->id}")
        ->assertForbidden();

    expect($admin->fresh()->deleted_at)->toBeNull();
});

it('prevents non-admin from creating users', function () {
    $this->actingAs(pendaftaranUser())
        ->post('/users', [
            'name' => 'New User',
            'email' => 'new@medora.id',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])
        ->assertForbidden();
});
