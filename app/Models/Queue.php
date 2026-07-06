<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'encounter_id', 'queue_type', 'sub_type', 'department_id', 'queue_number',
        'sequence', 'queue_date', 'status', 'called_at', 'served_at', 'finished_at', 'handled_by',
    ];

    protected $casts = [
        'queue_date' => 'date',
        'called_at' => 'datetime',
        'served_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function encounter(): BelongsTo
    {
        return $this->belongsTo(Encounter::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function handledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
