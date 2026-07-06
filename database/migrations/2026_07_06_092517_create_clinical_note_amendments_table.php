<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinical_note_amendments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinical_note_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinical_note_amendments');
    }
};
