<?php

namespace App\Policies;

use App\Models\Doctor;
use App\Models\User;

class DoctorPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function view(User $user, Doctor $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function update(User $user, Doctor $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function delete(User $user, Doctor $model): bool
    {
        return $user->can('masterdata.manage');
    }
}
