<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabTest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'price', 'is_active'];

    protected $casts = [
        'price' => 'integer',
        'is_active' => 'boolean',
    ];

    public function parameters(): HasMany
    {
        return $this->hasMany(LabTestParameter::class);
    }

    public function labOrderItems(): HasMany
    {
        return $this->hasMany(LabOrderItem::class);
    }
}
