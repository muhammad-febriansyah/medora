<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDoctorScheduleRequest;
use App\Http\Requests\UpdateDoctorScheduleRequest;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\DoctorSchedule;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DoctorScheduleController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(DoctorSchedule::class);
    }

    public function index(Doctor $doctor): Response
    {
        $doctor->load('user:id,name', 'defaultDepartment:id,name');

        $schedules = $doctor->schedules()->with('department:id,name')->latest()->paginate(15);

        return Inertia::render('MasterData/DoctorSchedules/Index', [
            'doctor' => $doctor,
            'schedules' => $schedules,
        ]);
    }

    public function create(Doctor $doctor): Response
    {
        return Inertia::render('MasterData/DoctorSchedules/Create', [
            'doctor' => $doctor->load('user:id,name'),
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreDoctorScheduleRequest $request, Doctor $doctor): RedirectResponse
    {
        $doctor->schedules()->create($request->validated());

        return redirect()
            ->route('doctors.schedules.index', $doctor)
            ->with('success', 'Jadwal dokter berhasil ditambahkan.');
    }

    public function show(Doctor $doctor, DoctorSchedule $schedule): Response
    {
        $schedule->load('doctor.user:id,name', 'department:id,name');

        return Inertia::render('MasterData/DoctorSchedules/Show', [
            'doctor' => $doctor->load('user:id,name'),
            'schedule' => $schedule,
        ]);
    }

    public function edit(Doctor $doctor, DoctorSchedule $schedule): Response
    {
        $schedule->load('department:id,name');

        return Inertia::render('MasterData/DoctorSchedules/Edit', [
            'doctor' => $doctor->load('user:id,name'),
            'schedule' => $schedule,
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateDoctorScheduleRequest $request, Doctor $doctor, DoctorSchedule $schedule): RedirectResponse
    {
        $schedule->update($request->validated());

        return redirect()
            ->route('doctors.schedules.index', $doctor)
            ->with('success', 'Jadwal dokter berhasil diperbarui.');
    }

    public function destroy(Doctor $doctor, DoctorSchedule $schedule): RedirectResponse
    {
        $schedule->delete();

        return redirect()
            ->route('doctors.schedules.index', $doctor)
            ->with('success', 'Jadwal dokter berhasil dihapus.');
    }
}
