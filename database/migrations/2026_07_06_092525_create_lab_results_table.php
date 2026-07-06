<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_order_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lab_test_parameter_id')->constrained()->cascadeOnDelete();
            $table->string('value');
            $table->string('unit_snapshot')->nullable();
            $table->string('normal_range_snapshot')->nullable();
            $table->enum('flag', ['normal', 'high', 'low'])->default('normal');
            $table->foreignId('amends_result_id')->nullable()->constrained('lab_results')->nullOnDelete();
            $table->foreignId('entered_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_results');
    }
};
