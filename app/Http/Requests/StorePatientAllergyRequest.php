<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientAllergyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('clinical.write');
    }

    public function rules(): array
    {
        return [
            'allergen' => ['required', 'string', 'max:255'],
            'severity' => ['required', 'in:mild,moderate,severe'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'allergen.required' => 'Nama alergen wajib diisi.',
            'severity.required' => 'Tingkat keparahan wajib dipilih.',
        ];
    }
}
