<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->enum('method', ['cash', 'transfer', 'qris_static']);
            $table->bigInteger('amount')->default(0);
            $table->bigInteger('amount_tendered')->nullable();
            $table->bigInteger('change_amount')->nullable();
            $table->foreignId('received_by')->constrained('users');
            $table->timestamp('paid_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
