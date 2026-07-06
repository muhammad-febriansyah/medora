<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('encounter_id')->constrained()->cascadeOnDelete();
            $table->enum('queue_type', ['poli', 'pharmacy']);
            $table->enum('sub_type', ['racikan', 'non_racikan'])->nullable();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->string('queue_number');
            $table->integer('sequence');
            $table->date('queue_date');
            $table->enum('status', ['waiting', 'called', 'serving', 'done', 'skipped'])->default('waiting');
            $table->timestamp('called_at')->nullable();
            $table->timestamp('served_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->foreignId('handled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::table('queues', function (Blueprint $table) {
            $table->index(['queue_type', 'department_id', 'queue_date', 'status']);
            $table->unique(['queue_type', 'department_id', 'queue_date', 'sequence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};
