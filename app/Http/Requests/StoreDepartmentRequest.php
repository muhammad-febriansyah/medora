<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('masterdata.manage');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'queue_code' => ['required', 'string', 'max:10', 'unique:departments,queue_code'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama poli wajib diisi.',
            'queue_code.required' => 'Kode antrian wajib diisi.',
            'queue_code.unique' => 'Kode antrian sudah dipakai.',
        ];
    }
}
