<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'medical_record_number', 'nik', 'name', 'birth_date', 'birth_place',
        'gender', 'address', 'phone', 'blood_type', 'occupation',
        'guardian_name', 'guardian_phone',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function allergies(): HasMany
    {
        return $this->hasMany(PatientAllergy::class);
    }

    public function encounters(): HasMany
    {
        return $this->hasMany(Encounter::class);
    }
}
