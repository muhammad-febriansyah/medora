<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->enum('category', ['registration', 'consultation', 'procedure', 'lab', 'medicine']);
            $table->string('item_name_snapshot');
            $table->bigInteger('unit_price_snapshot')->default(0);
            $table->smallInteger('quantity')->default(1);
            $table->bigInteger('line_total')->default(0);
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamps();
        });

        Schema::table('invoice_items', function (Blueprint $table) {
            $table->index(['invoice_id']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
