<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabTestParameter extends Model
{
    use HasFactory;

    protected $fillable = [
        'lab_test_id', 'parameter_name', 'unit',
        'normal_range_male', 'normal_range_female',
    ];

    public function labTest(): BelongsTo
    {
        return $this->belongsTo(LabTest::class);
    }

    public function labResults(): HasMany
    {
        return $this->hasMany(LabResult::class);
    }
}
