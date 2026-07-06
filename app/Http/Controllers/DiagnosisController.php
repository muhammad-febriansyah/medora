<?php

namespace App\Http\Controllers;

use App\Models\Diagnosis;
use App\Models\Encounter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DiagnosisController extends Controller
{
    public function store(Request $request, Encounter $encounter): RedirectResponse
    {
        $request->validate([
            'icd10_code_id' => ['required', 'exists:icd10_codes,id'],
            'type' => ['required', 'in:primary,secondary'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        if ($encounter->clinicalNote && $encounter->clinicalNote->status === 'final') {
            return back()->with('error', 'Catatan klinis sudah final.');
        }

        if ($request->type === 'primary') {
            $encounter->diagnoses()->where('type', 'primary')->update(['type' => 'secondary']);
        }

        $encounter->diagnoses()->create($request->validated());

        return back()->with('success', 'Diagnosa ditambahkan.');
    }

    public function destroy(Encounter $encounter, Diagnosis $diagnosis): RedirectResponse
    {
        if ($encounter->clinicalNote && $encounter->clinicalNote->status === 'final') {
            return back()->with('error', 'Catatan klinis sudah final.');
        }

        $diagnosis->delete();

        return back()->with('success', 'Diagnosa dihapus.');
    }
}
