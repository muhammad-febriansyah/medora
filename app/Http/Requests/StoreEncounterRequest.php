<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEncounterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('patients.manage');
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'encounter_date' => ['required', 'date'],
            'visit_type' => ['required', 'in:new,follow_up'],
            'payer_type' => ['required', 'in:self,insurance_manual'],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'Pasien wajib dipilih.',
            'department_id.required' => 'Poli wajib dipilih.',
            'doctor_id.required' => 'Dokter wajib dipilih.',
            'encounter_date.required' => 'Tanggal kunjungan wajib diisi.',
            'visit_type.required' => 'Jenis kunjungan wajib dipilih.',
            'payer_type.required' => 'Metode bayar wajib dipilih.',
        ];
    }
}
