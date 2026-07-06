<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_record_access_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('patient_id')->constrained();
            $table->foreignId('encounter_id')->nullable()->constrained()->nullOnDelete();
            $table->string('context');
            $table->boolean('is_break_the_glass')->default(false);
            $table->text('access_reason')->nullable();
            $table->timestamp('accessed_at')->useCurrent();
        });

        Schema::table('medical_record_access_logs', function (Blueprint $table) {
            $table->index(['patient_id', 'accessed_at']);
            $table->index(['user_id', 'accessed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_record_access_logs');
    }
};
