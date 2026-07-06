<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Service::class);
    }

    public function index(Request $request): Response
    {
        $services = Service::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('MasterData/Services/Index', [
            'services' => $services,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MasterData/Services/Create');
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        Service::create($request->validated());

        return redirect()->route('services.index')->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function show(Service $service): Response
    {
        return Inertia::render('MasterData/Services/Show', [
            'service' => $service,
        ]);
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('MasterData/Services/Edit', [
            'service' => $service,
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        return redirect()->route('services.index')->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()->route('services.index')->with('success', 'Layanan berhasil dihapus.');
    }
}
