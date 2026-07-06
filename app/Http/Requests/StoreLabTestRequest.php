<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLabTestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('masterdata.manage');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'parameters' => ['nullable', 'array'],
            'parameters.*.parameter_name' => ['required', 'string', 'max:255'],
            'parameters.*.unit' => ['nullable', 'string', 'max:50'],
            'parameters.*.normal_range_male' => ['nullable', 'string', 'max:100'],
            'parameters.*.normal_range_female' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama pemeriksaan wajib diisi.',
            'price.required' => 'Tarif wajib diisi.',
            'price.min' => 'Tarif tidak boleh negatif.',
            'parameters.*.parameter_name.required' => 'Nama parameter wajib diisi.',
        ];
    }
}
