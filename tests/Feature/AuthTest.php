<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

it('renders login page for guests', function () {
    $this->get('/login')->assertOk();
});

it('redirects unauthenticated users from dashboard to login', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

it('allows login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@medora.id',
        'password' => Hash::make('password123'),
    ]);

    $this->post('/login', [
        'email' => 'test@medora.id',
        'password' => 'password123',
    ])->assertRedirect('/dashboard');

    expect(auth()->check())->toBeTrue();
    expect(auth()->id())->toBe($user->id);
});

it('rejects login with invalid password', function () {
    User::factory()->create([
        'email' => 'test@medora.id',
        'password' => Hash::make('password123'),
    ]);

    $this->post('/login', [
        'email' => 'test@medora.id',
        'password' => 'wrong-password',
    ])->assertSessionHasErrors();

    expect(auth()->check())->toBeFalse();
});

it('prevents inactive users from logging in', function () {
    User::factory()->inactive()->create([
        'email' => 'inactive@medora.id',
        'password' => Hash::make('password123'),
    ]);

    $this->post('/login', [
        'email' => 'inactive@medora.id',
        'password' => 'password123',
    ]);

    expect(auth()->check())->toBeFalse();
});

it('logs out authenticated user', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post('/logout')->assertRedirect('/');

    expect(auth()->check())->toBeFalse();
});
