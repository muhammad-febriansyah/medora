<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVitalSignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('clinical.write');
    }

    public function rules(): array
    {
        return [
            'systolic' => ['required', 'integer', 'min:50', 'max:300'],
            'diastolic' => ['required', 'integer', 'min:30', 'max:200'],
            'pulse' => ['required', 'integer', 'min:30', 'max:250'],
            'temperature' => ['required', 'numeric', 'min:30', 'max:45'],
            'respiratory_rate' => ['required', 'integer', 'min:5', 'max:60'],
            'spo2' => ['required', 'integer', 'min:50', 'max:100'],
            'weight_kg' => ['nullable', 'numeric', 'min:0.5', 'max:500'],
            'height_cm' => ['nullable', 'numeric', 'min:20', 'max:300'],
            'chief_complaint' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'systolic.required' => 'TD sistolik wajib diisi.',
            'diastolic.required' => 'TD diastolik wajib diisi.',
            'pulse.required' => 'Nadi wajib diisi.',
            'temperature.required' => 'Suhu wajib diisi.',
            'temperature.min' => 'Suhu minimal 30 °C.',
            'temperature.max' => 'Suhu maksimal 45 °C.',
            'respiratory_rate.required' => 'Respiratory rate wajib diisi.',
            'spo2.required' => 'SpO2 wajib diisi.',
            'chief_complaint.required' => 'Keluhan utama wajib diisi.',
        ];
    }
}
