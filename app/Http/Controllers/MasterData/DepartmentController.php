<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Department::class);
    }

    public function index(Request $request): Response
    {
        $departments = Department::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('MasterData/Departments/Index', [
            'departments' => $departments,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MasterData/Departments/Create');
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        Department::create($request->validated());

        return redirect()->route('departments.index')->with('success', 'Poli berhasil ditambahkan.');
    }

    public function show(Department $department): Response
    {
        return Inertia::render('MasterData/Departments/Show', [
            'department' => $department,
        ]);
    }

    public function edit(Department $department): Response
    {
        return Inertia::render('MasterData/Departments/Edit', [
            'department' => $department,
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department): RedirectResponse
    {
        $department->update($request->validated());

        return redirect()->route('departments.index')->with('success', 'Poli berhasil diperbarui.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $department->delete();

        return redirect()->route('departments.index')->with('success', 'Poli berhasil dihapus.');
    }
}
