<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function view(User $user, Service $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function update(User $user, Service $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function delete(User $user, Service $model): bool
    {
        return $user->can('masterdata.manage');
    }
}
