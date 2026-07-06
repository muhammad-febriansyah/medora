<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('icd10_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('description_en');
            $table->string('description_id')->nullable();
            $table->timestamps();
        });

        Schema::table('icd10_codes', function (Blueprint $table) {
            $table->index('code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('icd10_codes');
    }
};
