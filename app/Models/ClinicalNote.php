<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClinicalNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'encounter_id', 'subjective', 'objective', 'assessment', 'plan',
        'status', 'finalized_at', 'finalized_by',
    ];

    protected $casts = ['finalized_at' => 'datetime'];

    public function encounter(): BelongsTo
    {
        return $this->belongsTo(Encounter::class);
    }

    public function finalizedBy(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'finalized_by');
    }

    public function amendments(): HasMany
    {
        return $this->hasMany(ClinicalNoteAmendment::class);
    }
}
