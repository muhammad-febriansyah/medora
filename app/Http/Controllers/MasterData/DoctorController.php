<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DoctorController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Doctor::class);
    }

    public function index(Request $request): Response
    {
        $doctors = Doctor::with('user:id,name,email', 'defaultDepartment:id,name')
            ->when($request->search, fn ($q, $s) => $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$s}%"))->orWhere('specialization', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('MasterData/Doctors/Index', [
            'doctors' => $doctors,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MasterData/Doctors/Create', [
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreDoctorRequest $request): RedirectResponse
    {
        Doctor::create($request->validated());

        return redirect()->route('doctors.index')->with('success', 'Dokter berhasil ditambahkan.');
    }

    public function show(Doctor $doctor): Response
    {
        $doctor->load('user:id,name,email', 'defaultDepartment:id,name', 'schedules.department:id,name');

        return Inertia::render('MasterData/Doctors/Show', [
            'doctor' => $doctor,
        ]);
    }

    public function edit(Doctor $doctor): Response
    {
        $doctor->load('user:id,name,email');

        return Inertia::render('MasterData/Doctors/Edit', [
            'doctor' => $doctor,
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateDoctorRequest $request, Doctor $doctor): RedirectResponse
    {
        $doctor->update($request->validated());

        return redirect()->route('doctors.index')->with('success', 'Dokter berhasil diperbarui.');
    }

    public function destroy(Doctor $doctor): RedirectResponse
    {
        $doctor->delete();

        return redirect()->route('doctors.index')->with('success', 'Dokter berhasil dihapus.');
    }
}
