<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabOrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['lab_order_id', 'lab_test_id', 'test_name_snapshot', 'price_snapshot'];

    protected $casts = ['price_snapshot' => 'integer'];

    public function labOrder(): BelongsTo
    {
        return $this->belongsTo(LabOrder::class);
    }

    public function labTest(): BelongsTo
    {
        return $this->belongsTo(LabTest::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(LabResult::class);
    }
}
