<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIcd10CodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('masterdata.manage');
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:10', 'unique:icd10_codes,code'],
            'description_en' => ['required', 'string', 'max:255'],
            'description_id' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode ICD-10 wajib diisi.',
            'code.unique' => 'Kode ICD-10 sudah ada.',
            'description_en.required' => 'Deskripsi wajib diisi.',
        ];
    }
}
