<?php

namespace App\Policies;

use App\Models\Medicine;
use App\Models\User;

class MedicinePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function view(User $user, Medicine $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function update(User $user, Medicine $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function delete(User $user, Medicine $model): bool
    {
        return $user->can('masterdata.manage');
    }
}
