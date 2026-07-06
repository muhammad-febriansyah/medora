<?php

namespace App\Policies;

use App\Models\Encounter;
use App\Models\User;

class EncounterPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canAny(['patients.manage', 'clinical.view']);
    }

    public function view(User $user, Encounter $model): bool
    {
        return $user->canAny(['patients.manage', 'clinical.view']);
    }

    public function create(User $user): bool
    {
        return $user->can('patients.manage');
    }

    public function update(User $user, Encounter $model): bool
    {
        return $user->can('patients.manage');
    }

    public function cancel(User $user, Encounter $model): bool
    {
        return $user->can('patients.manage') && in_array($model->status, ['registered', 'nurse_assessment']);
    }
}
