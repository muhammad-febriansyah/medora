<?php

namespace App\Policies;

use App\Models\DoctorSchedule;
use App\Models\User;

class DoctorSchedulePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function view(User $user, DoctorSchedule $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('masterdata.manage');
    }

    public function update(User $user, DoctorSchedule $model): bool
    {
        return $user->can('masterdata.manage');
    }

    public function delete(User $user, DoctorSchedule $model): bool
    {
        return $user->can('masterdata.manage');
    }
}
