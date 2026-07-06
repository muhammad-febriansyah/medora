<?php

namespace App\Policies;

use App\Models\LabTest;
use App\Models\User;

class LabTestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function view(User $user, LabTest $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function update(User $user, LabTest $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function delete(User $user, LabTest $model): bool
    {
        return $user->can('masterdata.manage');
    }
}
