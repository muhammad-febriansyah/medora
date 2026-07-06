<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Icd10Code;
use App\Models\LabTest;
use App\Models\LabTestParameter;
use App\Models\Medicine;
use App\Models\Service;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedDepartments();
        $this->seedServices();
        $this->seedIcd10Codes();
        $this->seedMedicines();
        $this->seedLabTests();
    }

    private function seedDepartments(): void
    {
        $departments = [
            ['name' => 'Poli Umum', 'queue_code' => 'UM', 'is_active' => true],
            ['name' => 'Poli Anak', 'queue_code' => 'AN', 'is_active' => true],
            ['name' => 'Poli Penyakit Dalam', 'queue_code' => 'PD', 'is_active' => true],
            ['name' => 'Poli Gigi', 'queue_code' => 'GI', 'is_active' => true],
            ['name' => 'Poli Kebidanan', 'queue_code' => 'OB', 'is_active' => true],
            ['name' => 'IGD', 'queue_code' => 'IG', 'is_active' => true],
            ['name' => 'Laboratorium', 'queue_code' => 'LB', 'is_active' => true],
            ['name' => 'Farmasi', 'queue_code' => 'FR', 'is_active' => true],
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }
    }

    private function seedServices(): void
    {
        $services = [
            ['name' => 'Konsultasi Poli Umum', 'category' => 'consultation', 'icd9cm_code' => '99213', 'price' => 75000, 'is_active' => true],
            ['name' => 'Konsultasi Poli Anak', 'category' => 'consultation', 'icd9cm_code' => '99213', 'price' => 100000, 'is_active' => true],
            ['name' => 'Konsultasi Poli Gigi', 'category' => 'consultation', 'icd9cm_code' => '99213', 'price' => 125000, 'is_active' => true],
            ['name' => 'Tambal Gigi', 'category' => 'procedure', 'icd9cm_code' => '2392', 'price' => 150000, 'is_active' => true],
            ['name' => 'Pencabutan Gigi', 'category' => 'procedure', 'icd9cm_code' => '2393', 'price' => 100000, 'is_active' => true],
            ['name' => 'Pemberian Injeksi', 'category' => 'procedure', 'icd9cm_code' => '90471', 'price' => 50000, 'is_active' => true],
            ['name' => 'Pendaftaran Rawat Jalan', 'category' => 'administration', 'icd9cm_code' => null, 'price' => 25000, 'is_active' => true],
            ['name' => 'Cek Tekanan Darah', 'category' => 'procedure', 'icd9cm_code' => '93784', 'price' => 25000, 'is_active' => true],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }

    private function seedIcd10Codes(): void
    {
        $codes = [
            ['code' => 'J00', 'description_en' => 'Acute nasopharyngitis', 'description_id' => 'Nasofaringitis akut (pilek biasa)'],
            ['code' => 'J06.9', 'description_en' => 'Acute upper respiratory infection, unspecified', 'description_id' => 'Infeksi saluran napas atas akut, tidak spesifik'],
            ['code' => 'J11.1', 'description_en' => 'Influenza with other respiratory manifestations', 'description_id' => 'Influenza dengan manifestasi pernapasan lainnya'],
            ['code' => 'K29.7', 'description_en' => 'Gastritis, unspecified', 'description_id' => 'Gastritis, tidak spesifik'],
            ['code' => 'A09', 'description_en' => 'Diarrhea and gastroenteritis of infectious origin', 'description_id' => 'Diare dan gastroenteritis akut'],
            ['code' => 'I10', 'description_en' => 'Essential (primary) hypertension', 'description_id' => 'Hipertensi primer'],
            ['code' => 'E11.9', 'description_en' => 'Type 2 diabetes mellitus without complications', 'description_id' => 'Diabetes mellitus tipe 2 tanpa komplikasi'],
            ['code' => 'M54.5', 'description_en' => 'Low back pain', 'description_id' => 'Nyeri punggung bawah'],
            ['code' => 'R51', 'description_en' => 'Headache', 'description_id' => 'Sakit kepala'],
            ['code' => 'K02.9', 'description_en' => 'Dental caries, unspecified', 'description_id' => 'Karies gigi, tidak spesifik'],
            ['code' => 'O00.9', 'description_en' => 'Ectopic pregnancy, unspecified', 'description_id' => 'Kehamilan ektopik, tidak spesifik'],
            ['code' => 'N39.0', 'description_en' => 'Urinary tract infection, site not specified', 'description_id' => 'Infeksi saluran kemih'],
            ['code' => 'L20.9', 'description_en' => 'Atopic dermatitis, unspecified', 'description_id' => 'Dermatitis atopik, tidak spesifik'],
            ['code' => 'B86', 'description_en' => 'Scabies', 'description_id' => 'Skabies (kudis)'],
            ['code' => 'A16.9', 'description_en' => 'Tuberculosis, unspecified', 'description_id' => 'Tuberkulosis, tidak spesifik'],
        ];

        foreach ($codes as $code) {
            Icd10Code::create($code);
        }
    }

    private function seedMedicines(): void
    {
        $medicines = [
            ['name' => 'Paracetamol 500mg', 'generic_name' => 'Paracetamol', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 500, 'stock_quantity' => 1000, 'minimum_stock' => 100, 'is_active' => true],
            ['name' => 'Amoxicillin 500mg', 'generic_name' => 'Amoxicillin', 'unit' => 'kapsul', 'dosage_form' => 'kapsul', 'selling_price' => 1000, 'stock_quantity' => 500, 'minimum_stock' => 50, 'is_active' => true],
            ['name' => 'Ibuprofen 400mg', 'generic_name' => 'Ibuprofen', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 800, 'stock_quantity' => 300, 'minimum_stock' => 50, 'is_active' => true],
            ['name' => 'Cetirizine 10mg', 'generic_name' => 'Cetirizine', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 700, 'stock_quantity' => 200, 'minimum_stock' => 30, 'is_active' => true],
            ['name' => 'Ranitidine 150mg', 'generic_name' => 'Ranitidine', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 600, 'stock_quantity' => 250, 'minimum_stock' => 30, 'is_active' => true],
            ['name' => 'Salbutamol 2mg', 'generic_name' => 'Salbutamol', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 900, 'stock_quantity' => 150, 'minimum_stock' => 20, 'is_active' => true],
            ['name' => 'Vitamin C 100mg', 'generic_name' => 'Ascorbic Acid', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 300, 'stock_quantity' => 800, 'minimum_stock' => 100, 'is_active' => true],
            ['name' => 'OBH Combi 100ml', 'generic_name' => 'Dextromethorphan', 'unit' => 'botol', 'dosage_form' => 'sirup', 'selling_price' => 15000, 'stock_quantity' => 100, 'minimum_stock' => 20, 'is_active' => true],
            ['name' => 'Ciprofloxacin 500mg', 'generic_name' => 'Ciprofloxacin', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 2000, 'stock_quantity' => 200, 'minimum_stock' => 30, 'is_active' => true],
            ['name' => 'Metformin 500mg', 'generic_name' => 'Metformin', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 500, 'stock_quantity' => 300, 'minimum_stock' => 50, 'is_active' => true],
            ['name' => 'Amlodipine 5mg', 'generic_name' => 'Amlodipine', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 600, 'stock_quantity' => 400, 'minimum_stock' => 50, 'is_active' => true],
            ['name' => 'Asam Mefenamat 500mg', 'generic_name' => 'Mefenamic Acid', 'unit' => 'tablet', 'dosage_form' => 'tablet', 'selling_price' => 700, 'stock_quantity' => 300, 'minimum_stock' => 40, 'is_active' => true],
        ];

        foreach ($medicines as $medicine) {
            Medicine::create($medicine);
        }
    }

    private function seedLabTests(): void
    {
        $tests = [
            ['name' => 'Darah Lengkap', 'price' => 75000, 'parameters' => [
                ['parameter_name' => 'Hemoglobin', 'unit' => 'g/dL', 'normal_range_male' => '13-17', 'normal_range_female' => '12-15'],
                ['parameter_name' => 'Leukosit', 'unit' => '/uL', 'normal_range_male' => '4000-11000', 'normal_range_female' => '4000-11000'],
                ['parameter_name' => 'Trombosit', 'unit' => '/uL', 'normal_range_male' => '150000-450000', 'normal_range_female' => '150000-450000'],
                ['parameter_name' => 'Eritrosit', 'unit' => '/uL', 'normal_range_male' => '4.5-5.9', 'normal_range_female' => '4.0-5.2'],
            ]],
            ['name' => 'Gula Darah', 'price' => 35000, 'parameters' => [
                ['parameter_name' => 'Glukosa Sewaktu', 'unit' => 'mg/dL', 'normal_range_male' => '70-140', 'normal_range_female' => '70-140'],
                ['parameter_name' => 'Glukosa Puasa', 'unit' => 'mg/dL', 'normal_range_male' => '70-100', 'normal_range_female' => '70-100'],
            ]],
            ['name' => 'Urinalisis', 'price' => 40000, 'parameters' => [
                ['parameter_name' => 'pH', 'unit' => '', 'normal_range_male' => '4.5-8.0', 'normal_range_female' => '4.5-8.0'],
                ['parameter_name' => 'Protein', 'unit' => '', 'normal_range_male' => 'Negatif', 'normal_range_female' => 'Negatif'],
                ['parameter_name' => 'Glukosa', 'unit' => '', 'normal_range_male' => 'Negatif', 'normal_range_female' => 'Negatif'],
            ]],
            ['name' => 'Kolesterol Total', 'price' => 50000, 'parameters' => [
                ['parameter_name' => 'Kolesterol Total', 'unit' => 'mg/dL', 'normal_range_male' => '<200', 'normal_range_female' => '<200'],
            ]],
            ['name' => 'Tes Kehamilan', 'price' => 30000, 'parameters' => [
                ['parameter_name' => 'hCG', 'unit' => 'mIU/mL', 'normal_range_male' => 'Negatif', 'normal_range_female' => 'Negatif'],
            ]],
        ];

        foreach ($tests as $test) {
            $labTest = LabTest::create([
                'name' => $test['name'],
                'price' => $test['price'],
                'is_active' => true,
            ]);

            foreach ($test['parameters'] as $param) {
                LabTestParameter::create(array_merge($param, ['lab_test_id' => $labTest->id]));
            }
        }
    }
}
