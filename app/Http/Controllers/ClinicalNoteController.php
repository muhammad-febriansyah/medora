<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\LabTest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClinicalNoteController extends Controller
{
    public function edit(Encounter $encounter): Response
    {
        $encounter->load([
            'patient:id,name,medical_record_number,birth_date,gender,allergies',
            'department:id,name',
            'doctor.user:id,name',
            'vitalSigns' => fn ($q) => $q->latest()->limit(1),
            'clinicalNote.amendments',
            'diagnoses.icd10Code',
            'procedures',
            'prescriptions.items.medicine',
            'labOrders.items.labTest',
        ]);

        return Inertia::render('Doctor/Emr', [
            'encounter' => $encounter,
            'labTests' => LabTest::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Encounter $encounter): RedirectResponse
    {
        $validated = $request->validate([
            'subjective' => ['nullable', 'string'],
            'objective' => ['nullable', 'string'],
            'assessment' => ['nullable', 'string'],
            'plan' => ['nullable', 'string'],
        ]);

        $note = $encounter->clinicalNote;

        if ($note && $note->status === 'final') {
            return back()->with('error', 'Catatan klinis sudah final.');
        }

        if ($note) {
            $note->update($validated);
        } else {
            $encounter->clinicalNote()->create([
                ...$validated,
                'status' => 'draft',
            ]);
        }

        return back()->with('success', 'Draft SOAP tersimpan.');
    }

    public function finalize(Encounter $encounter): RedirectResponse
    {
        $note = $encounter->clinicalNote;

        if (! $note) {
            return back()->with('error', 'Catatan klinis belum dibuat.');
        }

        if ($note->status === 'final') {
            return back()->with('error', 'Catatan klinis sudah final.');
        }

        if (empty($note->subjective) || empty($note->assessment)) {
            return back()->with('error', 'Subjective dan Assessment wajib diisi sebelum finalisasi.');
        }

        if ($encounter->diagnoses()->where('type', 'primary')->doesntExist()) {
            return back()->with('error', 'Diagnosa utama wajib diisi sebelum finalisasi.');
        }

        $note->update([
            'status' => 'final',
            'finalized_at' => now(),
            'finalized_by' => auth()->id(),
        ]);

        if ($encounter->prescriptions()->exists()) {
            $encounter->update(['status' => 'in_pharmacy']);
        } elseif ($encounter->labOrders()->exists()) {
            $encounter->update(['status' => 'waiting_lab']);
        } else {
            $encounter->update(['status' => 'waiting_payment']);
        }

        return back()->with('success', 'Catatan klinis berhasil difinalisasi.');
    }

    public function addAddendum(Request $request, Encounter $encounter): RedirectResponse
    {
        $request->validate(['content' => ['required', 'string', 'max:5000']], [
            'content.required' => 'Konten addendum wajib diisi.',
        ]);

        $note = $encounter->clinicalNote;

        if (! $note || $note->status !== 'final') {
            return back()->with('error', 'Catatan klinis harus final sebelum menambah addendum.');
        }

        $note->amendments()->create([
            'content' => $request->content,
            'created_by' => auth()->id(),
        ]);

        return back()->with('success', 'Addendum berhasil ditambahkan.');
    }
}
