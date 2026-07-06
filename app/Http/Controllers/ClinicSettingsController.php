<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClinicSettingsController extends Controller
{
    public function edit(): Response
    {
        $clinic = Clinic::first() ?? Clinic::create(['name' => 'Nama Klinik']);

        return Inertia::render('Settings/Clinic', [
            'clinic' => $clinic,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:20'],
            'license_number' => ['nullable', 'string', 'max:100'],
            'opening_hours' => ['nullable', 'string', 'max:100'],
            'rm_prefix' => ['required', 'string', 'max:10'],
            'rm_digits' => ['required', 'integer', 'min:3', 'max:10'],
            'default_registration_fee' => ['nullable', 'integer', 'min:0'],
        ], [
            'name.required' => 'Nama klinik wajib diisi.',
        ]);

        $clinic = Clinic::first();
        $clinic->update($request->validated());

        return back()->with('success', 'Pengaturan klinik berhasil disimpan.');
    }
}
