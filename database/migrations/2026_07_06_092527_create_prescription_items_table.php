<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prescription_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('medicine_id')->constrained();
            $table->string('medicine_name_snapshot');
            $table->bigInteger('price_snapshot')->default(0);
            $table->integer('quantity')->default(1);
            $table->string('dosage')->nullable();
            $table->string('instruction')->nullable();
            $table->boolean('is_racikan')->default(false);
            $table->text('racikan_instruction')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prescription_items');
    }
};
