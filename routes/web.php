<?php

use App\Http\Controllers\CashierController;
use App\Http\Controllers\ClinicalNoteController;
use App\Http\Controllers\ClinicSettingsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\EncounterController;
use App\Http\Controllers\LabOrderController;
use App\Http\Controllers\MasterData\DepartmentController;
use App\Http\Controllers\MasterData\DoctorController;
use App\Http\Controllers\MasterData\DoctorScheduleController;
use App\Http\Controllers\MasterData\Icd10CodeController;
use App\Http\Controllers\MasterData\LabTestController;
use App\Http\Controllers\MasterData\MedicineController;
use App\Http\Controllers\MasterData\ServiceController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\PrintController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VitalSignController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class);

    Route::resource('patients', PatientController::class);
    Route::post('/patients/{patient}/allergies', [PatientController::class, 'addAllergy'])->name('patients.allergies.store');
    Route::delete('/patients/{patient}/allergies/{allergy}', [PatientController::class, 'removeAllergy'])->name('patients.allergies.destroy');

    Route::get('/encounters/search-patient', [EncounterController::class, 'searchPatient'])->name('encounters.search-patient');
    Route::post('/encounters/{encounter}/cancel', [EncounterController::class, 'cancel'])->name('encounters.cancel');
    Route::resource('encounters', EncounterController::class)->parameters(['encounters' => 'encounter:uuid']);

    Route::get('/nurse/worklist', [QueueController::class, 'nurseWorklist'])->name('nurse.worklist');
    Route::get('/nurse/assessment/{encounter}', [VitalSignController::class, 'create'])->name('nurse.assessment');
    Route::post('/nurse/assessment/{encounter}', [VitalSignController::class, 'store']);

    Route::get('/doctor/worklist', [QueueController::class, 'doctorWorklist'])->name('doctor.worklist');
    Route::get('/doctor/emr/{encounter}', [ClinicalNoteController::class, 'edit'])->name('doctor.emr');
    Route::put('/doctor/emr/{encounter}/soap', [ClinicalNoteController::class, 'update']);
    Route::post('/doctor/emr/{encounter}/finalize', [ClinicalNoteController::class, 'finalize'])->name('doctor.finalize');
    Route::post('/doctor/emr/{encounter}/addendum', [ClinicalNoteController::class, 'addAddendum'])->name('doctor.addendum');

    Route::get('/pharmacy/worklist', [PrescriptionController::class, 'worklist'])->name('pharmacy.worklist');
    Route::get('/pharmacy/review/{prescription}', [PrescriptionController::class, 'review'])->name('pharmacy.review');
    Route::post('/pharmacy/{prescription}/verify', [PrescriptionController::class, 'verify'])->name('pharmacy.verify');
    Route::post('/pharmacy/{prescription}/flag', [PrescriptionController::class, 'flag'])->name('pharmacy.flag');
    Route::post('/pharmacy/{prescription}/dispense', [PrescriptionController::class, 'dispense'])->name('pharmacy.dispense');
    Route::post('/pharmacy/{prescription}/handover', [PrescriptionController::class, 'handOver'])->name('pharmacy.handover');
    Route::get('/medicines/search', [PrescriptionController::class, 'searchMedicine']);
    Route::post('/prescriptions', [PrescriptionController::class, 'store'])->name('prescriptions.store');

    Route::get('/lab/worklist', [LabOrderController::class, 'worklist'])->name('lab.worklist');
    Route::get('/lab/{order}/process', [LabOrderController::class, 'process'])->name('lab.process');
    Route::post('/lab-orders', [LabOrderController::class, 'store'])->name('lab-orders.store');

    Route::get('/cashier/worklist', [CashierController::class, 'worklist'])->name('cashier.worklist');
    Route::get('/cashier/pay/{encounter}', [CashierController::class, 'process'])->name('cashier.process');
    Route::post('/cashier/pay/{encounter}', [CashierController::class, 'pay']);

    Route::get('/medical-records/incomplete', [MedicalRecordController::class, 'incompleteEncounters'])->name('rm.incomplete');
    Route::get('/medical-records/access-logs', [MedicalRecordController::class, 'accessLogs'])->name('rm.access-logs');
    Route::get('/medical-records/patient-history', [MedicalRecordController::class, 'patientHistory'])->name('rm.patient-history');

    Route::post('/diagnoses/{encounter}', [DiagnosisController::class, 'store'])->name('diagnoses.store');
    Route::delete('/diagnoses/{encounter}/{diagnosis}', [DiagnosisController::class, 'destroy'])->name('diagnoses.destroy');

    Route::post('/queues/{queue}/call', [QueueController::class, 'call'])->name('queues.call');
    Route::post('/queues/{queue}/serve', [QueueController::class, 'serve'])->name('queues.serve');
    Route::post('/queues/{queue}/done', [QueueController::class, 'done'])->name('queues.done');
    Route::post('/queues/{queue}/skip', [QueueController::class, 'skip'])->name('queues.skip');

    Route::resource('departments', DepartmentController::class);
    Route::resource('services', ServiceController::class);
    Route::get('/icd10-codes/search', [Icd10CodeController::class, 'search']);
    Route::resource('icd10-codes', Icd10CodeController::class);
    Route::resource('medicines', MedicineController::class);
    Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
    Route::post('/stock/in', [StockController::class, 'stockIn'])->name('stock.in');
    Route::post('/stock/adjust', [StockController::class, 'adjust'])->name('stock.adjust');
    Route::resource('doctors', DoctorController::class);
    Route::resource('doctors.schedules', DoctorScheduleController::class);
    Route::get('/settings/clinic', [ClinicSettingsController::class, 'edit'])->name('settings.clinic');
    Route::put('/settings/clinic', [ClinicSettingsController::class, 'update']);

    Route::get('/print/receipt/{encounter}', [PrintController::class, 'receipt'])->name('print.receipt');
    Route::get('/print/prescription/{prescription}', [PrintController::class, 'prescription'])->name('print.prescription');
    Route::get('/print/sick-leave/{encounter}', [PrintController::class, 'sickLeave'])->name('print.sick-leave');
    Route::get('/print/referral/{encounter}', [PrintController::class, 'referral'])->name('print.referral');

    Route::resource('lab-tests', LabTestController::class);
});

Route::get('/display', [QueueController::class, 'display'])->name('display');
