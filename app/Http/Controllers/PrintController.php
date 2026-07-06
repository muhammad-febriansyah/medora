<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\Encounter;
use App\Models\Prescription;
use Inertia\Inertia;
use Inertia\Response;

class PrintController extends Controller
{
    public function receipt(Encounter $encounter): Response
    {
        $encounter->load([
            'patient:id,name,medical_record_number',
            'department:id,name',
            'invoice.payments',
            'invoice.items',
        ]);

        return Inertia::render('Print/Receipt', [
            'encounter' => $encounter,
            'clinic' => Clinic::first(),
        ]);
    }

    public function prescription(Prescription $prescription): Response
    {
        $prescription->load([
            'encounter.patient:id,name,medical_record_number,birth_date',
            'encounter.doctor.user:id,name',
            'items.medicine:id,name,unit',
        ]);

        return Inertia::render('Print/Prescription', [
            'prescription' => $prescription,
            'clinic' => Clinic::first(),
        ]);
    }

    public function sickLeave(Encounter $encounter): Response
    {
        $encounter->load([
            'patient:id,name,medical_record_number,birth_date,gender,address',
            'doctor.user:id,name,sip_number',
            'diagnoses.icd10Code',
        ]);

        return Inertia::render('Print/SickLeave', [
            'encounter' => $encounter,
            'clinic' => Clinic::first(),
            'days' => request('days', 3),
        ]);
    }

    public function referral(Encounter $encounter): Response
    {
        $encounter->load([
            'patient:id,name,medical_record_number,birth_date,gender,address',
            'doctor.user:id,name,sip_number',
            'diagnoses.icd10Code',
        ]);

        return Inertia::render('Print/Referral', [
            'encounter' => $encounter,
            'clinic' => Clinic::first(),
        ]);
    }
}
