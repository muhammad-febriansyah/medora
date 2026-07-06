<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    protected $fillable = [
        'name', 'logo', 'address', 'phone', 'license_number',
        'opening_hours', 'rm_prefix', 'rm_digits', 'default_registration_fee',
    ];

    protected $casts = [
        'default_registration_fee' => 'integer',
        'rm_digits' => 'integer',
    ];
}
