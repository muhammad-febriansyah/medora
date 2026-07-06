<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('encounters', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained();
            $table->foreignId('doctor_id')->nullable()->constrained()->nullOnDelete();
            $table->date('encounter_date');
            $table->enum('visit_type', ['new', 'follow_up']);
            $table->enum('payer_type', ['self', 'insurance_manual']);
            $table->enum('status', ['registered', 'nurse_assessment', 'in_consultation', 'waiting_lab', 'in_pharmacy', 'waiting_payment', 'completed', 'cancelled'])->default('registered');
            $table->text('cancellation_reason')->nullable();
            $table->foreignId('registered_by')->constrained('users');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::table('encounters', function (Blueprint $table) {
            $table->index(['patient_id', 'encounter_date']);
            $table->index(['department_id', 'encounter_date', 'status']);
            $table->index(['doctor_id', 'encounter_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('encounters');
    }
};
