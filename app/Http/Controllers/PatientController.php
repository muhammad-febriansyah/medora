<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientAllergyRequest;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use App\Models\PatientAllergy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Patient::class);
    }

    public function index(Request $request): Response
    {
        $patients = Patient::query()
            ->when($request->search, function ($q, $s) {
                $q->where(function ($q) use ($s) {
                    $q->where('medical_record_number', 'like', "%{$s}%")
                        ->orWhere('nik', 'like', "%{$s}%")
                        ->orWhere('name', 'like', "%{$s}%")
                        ->orWhere('phone', 'like', "%{$s}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function create(Request $request): Response
    {
        $duplicates = [];
        $nik = $request->query('nik');

        if ($nik) {
            $duplicates = Patient::where('nik', $nik)->get(['id', 'name', 'medical_record_number', 'birth_date', 'nik']);
        }

        $nextRm = $this->generateNextRm();

        return Inertia::render('Patients/Create', [
            'nextRm' => $nextRm,
            'duplicates' => $duplicates,
            'prefillNIK' => $request->query('nik'),
        ]);
    }

    public function store(StorePatientRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['medical_record_number'] = $this->generateNextRm();

        $patient = Patient::create($data);

        return redirect()->route('patients.show', $patient)->with('success', 'Pasien berhasil didaftarkan.');
    }

    public function show(Patient $patient): Response
    {
        $patient->load('allergies.recordedBy:id,name');

        return Inertia::render('Patients/Show', [
            'patient' => $patient,
            'canManageAllergies' => auth()->user()->can('clinical.write'),
        ]);
    }

    public function edit(Patient $patient): Response
    {
        return Inertia::render('Patients/Edit', [
            'patient' => $patient,
        ]);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): RedirectResponse
    {
        $patient->update($request->validated());

        return redirect()->route('patients.show', $patient)->with('success', 'Data pasien berhasil diperbarui.');
    }

    public function destroy(Patient $patient): RedirectResponse
    {
        $patient->delete();

        return redirect()->route('patients.index')->with('success', 'Pasien berhasil dihapus.');
    }

    public function addAllergy(StorePatientAllergyRequest $request, Patient $patient): RedirectResponse
    {
        $patient->allergies()->create([
            ...$request->validated(),
            'recorded_by' => auth()->id(),
        ]);

        return back()->with('success', 'Alergi berhasil ditambahkan.');
    }

    public function removeAllergy(Patient $patient, PatientAllergy $allergy): RedirectResponse
    {
        $allergy->delete();

        return back()->with('success', 'Alergi berhasil dihapus.');
    }

    private function generateNextRm(): string
    {
        $last = Patient::withTrashed()
            ->where('medical_record_number', 'like', 'RM-%')
            ->orderByRaw('CAST(SUBSTRING(medical_record_number, 4) AS UNSIGNED) DESC')
            ->lockForUpdate()
            ->value('medical_record_number');

        $next = $last ? ((int) substr($last, 3)) + 1 : 1;

        return 'RM-'.str_pad((string) $next, 6, '0', STR_PAD_LEFT);
    }
}
