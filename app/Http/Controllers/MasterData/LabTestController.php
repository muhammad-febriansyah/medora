<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLabTestRequest;
use App\Http\Requests\UpdateLabTestRequest;
use App\Models\LabTest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LabTestController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(LabTest::class);
    }

    public function index(Request $request): Response
    {
        $labTests = LabTest::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('MasterData/LabTests/Index', [
            'labTests' => $labTests,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MasterData/LabTests/Create');
    }

    public function store(StoreLabTestRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $labTest = LabTest::create($request->only('name', 'price', 'is_active'));

            if ($request->has('parameters')) {
                foreach ($request->parameters as $param) {
                    $labTest->parameters()->create($param);
                }
            }
        });

        return redirect()->route('lab-tests.index')->with('success', 'Pemeriksaan lab berhasil ditambahkan.');
    }

    public function show(LabTest $labTest): Response
    {
        $labTest->load('parameters');

        return Inertia::render('MasterData/LabTests/Show', [
            'labTest' => $labTest,
        ]);
    }

    public function edit(LabTest $labTest): Response
    {
        $labTest->load('parameters');

        return Inertia::render('MasterData/LabTests/Edit', [
            'labTest' => $labTest,
        ]);
    }

    public function update(UpdateLabTestRequest $request, LabTest $labTest): RedirectResponse
    {
        DB::transaction(function () use ($request, $labTest) {
            $labTest->update($request->only('name', 'price', 'is_active'));

            if ($request->has('parameters')) {
                $labTest->parameters()->delete();

                foreach ($request->parameters as $param) {
                    $labTest->parameters()->create($param);
                }
            }
        });

        return redirect()->route('lab-tests.index')->with('success', 'Pemeriksaan lab berhasil diperbarui.');
    }

    public function destroy(LabTest $labTest): RedirectResponse
    {
        $labTest->delete();

        return redirect()->route('lab-tests.index')->with('success', 'Pemeriksaan lab berhasil dihapus.');
    }
}
