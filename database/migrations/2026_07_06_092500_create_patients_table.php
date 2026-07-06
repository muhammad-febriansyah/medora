<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('medical_record_number')->unique();
            $table->string('nik')->nullable()->unique();
            $table->string('name');
            $table->date('birth_date');
            $table->string('birth_place')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('blood_type')->nullable();
            $table->string('occupation')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('patients', function (Blueprint $table) {
            $table->index('name');
            $table->index('birth_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
