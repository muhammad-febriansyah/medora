<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('masterdata.manage');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:consultation,procedure,administration,lab'],
            'icd9cm_code' => ['nullable', 'string', 'max:20'],
            'price' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama layanan wajib diisi.',
            'category.required' => 'Kategori wajib dipilih.',
            'price.required' => 'Tarif wajib diisi.',
            'price.min' => 'Tarif tidak boleh negatif.',
        ];
    }
}
