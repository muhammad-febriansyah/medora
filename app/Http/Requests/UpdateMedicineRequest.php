<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('masterdata.manage');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'generic_name' => ['nullable', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:50'],
            'dosage_form' => ['nullable', 'string', 'max:50'],
            'selling_price' => ['required', 'integer', 'min:0'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama obat wajib diisi.',
            'unit.required' => 'Satuan wajib diisi.',
            'selling_price.required' => 'Harga jual wajib diisi.',
            'selling_price.min' => 'Harga jual tidak boleh negatif.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
        ];
    }
}
