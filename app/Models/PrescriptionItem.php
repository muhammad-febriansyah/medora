<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrescriptionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_id', 'medicine_id', 'medicine_name_snapshot', 'price_snapshot',
        'quantity', 'dosage', 'instruction', 'is_racikan', 'racikan_instruction',
    ];

    protected $casts = [
        'price_snapshot' => 'integer',
        'quantity' => 'integer',
        'is_racikan' => 'boolean',
    ];

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(Prescription::class);
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }
}
