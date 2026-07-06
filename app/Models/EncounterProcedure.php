<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EncounterProcedure extends Model
{
    use HasFactory;

    protected $fillable = [
        'encounter_id', 'service_id', 'service_name_snapshot', 'price_snapshot', 'quantity', 'performed_by',
    ];

    protected $casts = [
        'price_snapshot' => 'integer',
        'quantity' => 'integer',
    ];

    public function encounter(): BelongsTo
    {
        return $this->belongsTo(Encounter::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
