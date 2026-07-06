<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIcd10CodeRequest;
use App\Http\Requests\UpdateIcd10CodeRequest;
use App\Models\Icd10Code;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class Icd10CodeController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Icd10Code::class);
    }

    public function index(Request $request): Response
    {
        $codes = Icd10Code::query()
            ->when($request->search, fn ($q, $s) => $q->where('code', 'like', "%{$s}%")->orWhere('description_id', 'like', "%{$s}%"))
            ->orderBy('code')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MasterData/Icd10Codes/Index', [
            'codes' => $codes,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MasterData/Icd10Codes/Create');
    }

    public function store(StoreIcd10CodeRequest $request): RedirectResponse
    {
        Icd10Code::create($request->validated());

        return redirect()->route('icd10-codes.index')->with('success', 'Kode ICD-10 berhasil ditambahkan.');
    }

    public function show(Icd10Code $code): Response
    {
        return Inertia::render('MasterData/Icd10Codes/Show', [
            'code' => $code,
        ]);
    }

    public function edit(Icd10Code $code): Response
    {
        return Inertia::render('MasterData/Icd10Codes/Edit', [
            'code' => $code,
        ]);
    }

    public function update(UpdateIcd10CodeRequest $request, Icd10Code $code): RedirectResponse
    {
        $code->update($request->validated());

        return redirect()->route('icd10-codes.index')->with('success', 'Kode ICD-10 berhasil diperbarui.');
    }

    public function destroy(Icd10Code $code): RedirectResponse
    {
        $code->delete();

        return redirect()->route('icd10-codes.index')->with('success', 'Kode ICD-10 berhasil dihapus.');
    }

    public function search(Request $request): JsonResponse
    {
        $codes = Icd10Code::where('code', 'like', "%{$request->q}%")
            ->orWhere('description_id', 'like', "%{$request->q}%")
            ->orWhere('description_en', 'like', "%{$request->q}%")
            ->limit(20)
            ->get(['id', 'code', 'description_en', 'description_id']);

        return response()->json($codes);
    }
}
