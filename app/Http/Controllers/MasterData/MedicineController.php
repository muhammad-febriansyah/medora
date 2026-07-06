<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMedicineRequest;
use App\Http\Requests\UpdateMedicineRequest;
use App\Models\Medicine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicineController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Medicine::class);
    }

    public function index(Request $request): Response
    {
        $medicines = Medicine::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('generic_name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('MasterData/Medicines/Index', [
            'medicines' => $medicines,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MasterData/Medicines/Create');
    }

    public function store(StoreMedicineRequest $request): RedirectResponse
    {
        Medicine::create($request->validated());

        return redirect()->route('medicines.index')->with('success', 'Obat berhasil ditambahkan.');
    }

    public function show(Medicine $medicine): Response
    {
        return Inertia::render('MasterData/Medicines/Show', [
            'medicine' => $medicine,
        ]);
    }

    public function edit(Medicine $medicine): Response
    {
        return Inertia::render('MasterData/Medicines/Edit', [
            'medicine' => $medicine,
        ]);
    }

    public function update(UpdateMedicineRequest $request, Medicine $medicine): RedirectResponse
    {
        $medicine->update($request->validated());

        return redirect()->route('medicines.index')->with('success', 'Obat berhasil diperbarui.');
    }

    public function destroy(Medicine $medicine): RedirectResponse
    {
        $medicine->delete();

        return redirect()->route('medicines.index')->with('success', 'Obat berhasil dihapus.');
    }
}
