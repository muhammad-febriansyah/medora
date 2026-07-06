<?php

namespace App\Policies;

use App\Models\Icd10Code;
use App\Models\User;

class Icd10CodePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function view(User $user, Icd10Code $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function update(User $user, Icd10Code $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function delete(User $user, Icd10Code $model): bool
    {
        return $user->can('masterdata.manage');
    }
}
