<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VitalSign extends Model
{
    use HasFactory;

    protected $fillable = [
        'encounter_id', 'systolic', 'diastolic', 'pulse', 'temperature',
        'respiratory_rate', 'spo2', 'weight_kg', 'height_cm', 'chief_complaint', 'recorded_by',
    ];

    protected $casts = [
        'temperature' => 'decimal:1',
        'weight_kg' => 'decimal:2',
        'height_cm' => 'decimal:2',
    ];

    public function encounter(): BelongsTo
    {
        return $this->belongsTo(Encounter::class);
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
