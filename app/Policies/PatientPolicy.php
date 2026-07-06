<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;

class PatientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('patients.view_demographics');
    }

    public function view(User $user, Patient $model): bool
    {
        return $user->can('patients.view_demographics');
    }

    public function create(User $user): bool
    {
        return $user->can('patients.manage');
    }

    public function update(User $user, Patient $model): bool
    {
        return $user->can('patients.manage');
    }

    public function delete(User $user, Patient $model): bool
    {
        return $user->can('patients.manage');
    }
}
