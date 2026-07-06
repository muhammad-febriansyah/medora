<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\MedicalRecordAccessLog;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicalRecordController extends Controller
{
    public function incompleteEncounters(): Response
    {
        $encounters = Encounter::with(['patient:id,name,medical_record_number', 'department:id,name', 'clinicalNote', 'diagnoses'])
            ->whereNotIn('status', ['cancelled', 'completed'])
            ->whereDate('encounter_date', '>=', now()->subDays(7))
            ->where(function ($q) {
                $q->doesntHave('clinicalNote')
                    ->orWhereHas('clinicalNote', fn ($q) => $q->where('status', '!=', 'final'))
                    ->orWhereDoesntHave('diagnoses', fn ($q) => $q->where('type', 'primary'));
            })
            ->latest()
            ->paginate(15);

        return Inertia::render('MedicalRecords/Incomplete', [
            'encounters' => $encounters,
        ]);
    }

    public function accessLogs(Request $request): Response
    {
        $logs = MedicalRecordAccessLog::with(['user:id,name', 'patient:id,name,medical_record_number'])
            ->latest()
            ->paginate(20);

        return Inertia::render('MedicalRecords/AccessLogs', [
            'logs' => $logs,
        ]);
    }

    public function patientHistory(Request $request): Response
    {
        $patient = Patient::where('medical_record_number', $request->rm)->first();

        if (! $patient) {
            return Inertia::render('MedicalRecords/PatientHistory', [
                'patient' => null,
                'encounters' => [],
            ]);
        }

        $encounters = $patient->encounters()
            ->with(['department:id,name', 'doctor.user:id,name', 'diagnoses.icd10Code', 'clinicalNote'])
            ->latest()
            ->paginate(15);

        return Inertia::render('MedicalRecords/PatientHistory', [
            'patient' => $patient,
            'encounters' => $encounters,
        ]);
    }
}
