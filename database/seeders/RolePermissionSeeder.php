<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Permissions grouped by domain per PRD M1.
     */
    private array $permissions = [
        'patients.view_demographics',
        'patients.manage',
        'clinical.view',
        'clinical.write',
        'clinical.finalize',
        'prescriptions.create',
        'prescriptions.dispense',
        'billing.view',
        'billing.process',
        'billing.discount',
        'reports.view',
        'masterdata.manage',
        'users.manage',
        'access_logs.view',
    ];

    /**
     * Role → permission mapping per PRD M1.
     */
    private array $rolePermissions = [
        'admin' => [
            'patients.view_demographics', 'patients.manage',
            'clinical.view',
            'billing.view', 'billing.process', 'billing.discount',
            'reports.view', 'masterdata.manage', 'users.manage', 'access_logs.view',
        ],
        'pendaftaran' => [
            'patients.view_demographics', 'patients.manage',
        ],
        'perawat' => [
            'clinical.view', 'clinical.write',
        ],
        'dokter' => [
            'clinical.view', 'clinical.write', 'clinical.finalize',
            'prescriptions.create',
        ],
        'apoteker' => [
            'prescriptions.create', 'prescriptions.dispense',
            'masterdata.manage',
        ],
        'petugas_lab' => [
            'clinical.view',
        ],
        'kasir' => [
            'billing.view', 'billing.process',
        ],
        'petugas_rm' => [
            'clinical.view', 'access_logs.view', 'reports.view',
        ],
    ];

    public function run(): void
    {
        foreach ($this->permissions as $name) {
            Permission::firstOrCreate(['name' => $name]);
        }

        foreach ($this->rolePermissions as $role => $permissions) {
            Role::firstOrCreate(['name' => $role])
                ->syncPermissions($permissions);
        }
    }
}
