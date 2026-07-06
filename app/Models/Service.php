<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'category', 'icd9cm_code', 'price', 'is_active'];

    protected $casts = [
        'price' => 'integer',
        'is_active' => 'boolean',
    ];

    public function encounterProcedures(): HasMany
    {
        return $this->hasMany(EncounterProcedure::class);
    }
}
