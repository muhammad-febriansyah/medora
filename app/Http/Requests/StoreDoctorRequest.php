<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('masterdata.manage');
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'sip_number' => ['required', 'string', 'max:50'],
            'str_number' => ['required', 'string', 'max:50'],
            'specialization' => ['nullable', 'string', 'max:100'],
            'default_department_id' => ['nullable', 'exists:departments,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User wajib dipilih.',
            'sip_number.required' => 'Nomor SIP wajib diisi.',
            'str_number.required' => 'Nomor STR wajib diisi.',
        ];
    }
}
