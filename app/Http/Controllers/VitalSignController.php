<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVitalSignRequest;
use App\Models\Encounter;
use App\Models\VitalSign;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VitalSignController extends Controller
{
    public function create(Encounter $encounter): Response
    {
        $previous = VitalSign::whereHas('encounter', fn ($q) => $q->where('patient_id', $encounter->patient_id))
            ->where('encounter_id', '!=', $encounter->id)
            ->with('encounter:encounters.id,encounter_date')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Nurse/Assessment', [
            'encounter' => $encounter->load(['patient:id,name,medical_record_number,birth_date,gender,allergies', 'department:id,name', 'queues' => fn ($q) => $q->where('queue_type', 'poli')->orderBy('created_at')]),
            'previousVitals' => $previous,
            'existingVitalSign' => $encounter->vitalSigns()->latest()->first(),
        ]);
    }

    public function store(StoreVitalSignRequest $request, Encounter $encounter): RedirectResponse
    {
        $vitalSign = $encounter->vitalSigns()->create([
            ...$request->validated(),
            'recorded_by' => auth()->id(),
        ]);

        $encounter->update(['status' => 'nurse_assessment']);

        return redirect()->route('nurse.worklist')->with('success', 'Asesmen perawat berhasil dicatat.');
    }
}
