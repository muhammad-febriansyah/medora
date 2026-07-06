<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('patients.manage');
    }

    public function rules(): array
    {
        return [
            'nik' => ['nullable', 'string', 'digits:16', 'unique:patients,nik'],
            'name' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'birth_place' => ['required', 'string', 'max:100'],
            'gender' => ['required', 'in:male,female'],
            'address' => ['required', 'string', 'max:500'],
            'phone' => ['required', 'string', 'max:15'],
            'blood_type' => ['nullable', 'in:A,B,AB,O'],
            'occupation' => ['nullable', 'string', 'max:100'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:15'],
        ];
    }

    public function messages(): array
    {
        return [
            'nik.digits' => 'NIK harus 16 digit.',
            'nik.unique' => 'NIK sudah terdaftar.',
            'name.required' => 'Nama pasien wajib diisi.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'birth_place.required' => 'Tempat lahir wajib diisi.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'address.required' => 'Alamat wajib diisi.',
            'phone.required' => 'Nomor telepon wajib diisi.',
        ];
    }
}
