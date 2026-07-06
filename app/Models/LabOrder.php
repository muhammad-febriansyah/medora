<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabOrder extends Model
{
    use HasFactory;

    protected $fillable = ['encounter_id', 'status', 'ordered_by', 'resulted_at'];

    protected $casts = ['resulted_at' => 'datetime'];

    public function encounter(): BelongsTo
    {
        return $this->belongsTo(Encounter::class);
    }

    public function orderedBy(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'ordered_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(LabOrderItem::class);
    }
}
