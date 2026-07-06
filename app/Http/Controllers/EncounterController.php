<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEncounterRequest;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Encounter;
use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Queue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EncounterController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Encounter::class);
    }

    public function index(Request $request): Response
    {
        $encounters = Encounter::with(['patient:id,name,medical_record_number', 'department:id,name', 'doctor.user:id,name'])
            ->when($request->search, fn ($q, $s) => $q->whereHas('patient', fn ($p) => $p->where('name', 'like', "%{$s}%")->orWhere('medical_record_number', 'like', "%{$s}%")))
            ->when($request->date, fn ($q, $d) => $q->whereDate('encounter_date', $d))
            ->when($request->department_id, fn ($q, $d) => $q->where('department_id', $d))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Encounters/Index', [
            'encounters' => $encounters,
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $request->search,
                'date' => $request->date ?? now()->toDateString(),
                'department_id' => $request->department_id,
                'status' => $request->status,
            ],
        ]);
    }

    public function create(): Response
    {
        $today = now()->toDateString();

        $doctors = Doctor::with('user:id,name')
            ->whereHas('schedules', fn ($q) => $q->where('day_of_week', now()->dayOfWeekIso)->where('is_active', true))
            ->get(['id', 'user_id', 'default_department_id']);

        return Inertia::render('Encounters/Create', [
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'doctors' => $doctors,
            'today' => $today,
        ]);
    }

    public function searchPatient(Request $request): JsonResponse
    {
        $patients = Patient::query()
            ->when($request->q, fn ($q, $s) => $q->where('medical_record_number', 'like', "%{$s}%")
                ->orWhere('nik', 'like', "%{$s}%")
                ->orWhere('name', 'like', "%{$s}%"))
            ->limit(20)
            ->get(['id', 'name', 'medical_record_number', 'nik', 'birth_date', 'gender']);

        return response()->json($patients);
    }

    public function store(StoreEncounterRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $encounter = DB::transaction(function () use ($validated) {
            $encounter = Encounter::create([
                ...$validated,
                'uuid' => (string) Str::uuid(),
                'status' => 'registered',
                'registered_by' => auth()->id(),
            ]);

            $department = Department::find($validated['department_id']);
            $sequence = Queue::where('queue_type', 'poli')
                ->where('department_id', $department->id)
                ->whereDate('queue_date', $validated['encounter_date'])
                ->max('sequence');

            $nextSequence = ($sequence ?? 0) + 1;

            Queue::create([
                'encounter_id' => $encounter->id,
                'queue_type' => 'poli',
                'department_id' => $department->id,
                'queue_number' => $department->queue_code.'-'.str_pad((string) $nextSequence, 3, '0', STR_PAD_LEFT),
                'sequence' => $nextSequence,
                'queue_date' => $validated['encounter_date'],
                'status' => 'waiting',
            ]);

            $invoiceNumber = 'INV-'.now()->format('Ymd').'-'.str_pad((string) (Invoice::whereDate('created_at', now())->count() + 1), 4, '0', STR_PAD_LEFT);

            Invoice::create([
                'invoice_number' => $invoiceNumber,
                'encounter_id' => $encounter->id,
                'status' => 'draft',
                'subtotal' => 0,
                'total' => 0,
                'discount_amount' => 0,
            ]);

            return $encounter;
        });

        return redirect()->route('encounters.show', $encounter)->with('success', 'Kunjungan berhasil didaftarkan.');
    }

    public function show(Encounter $encounter): Response
    {
        $encounter->load([
            'patient.allergies',
            'department:id,name',
            'doctor.user:id,name',
            'registeredBy:id,name',
            'queues' => fn ($q) => $q->orderBy('created_at'),
            'invoice.items',
        ]);

        return Inertia::render('Encounters/Show', [
            'encounter' => $encounter,
        ]);
    }

    public function cancel(Request $request, Encounter $encounter): RedirectResponse
    {
        $request->validate(['reason' => ['required', 'string', 'max:500']], [
            'reason.required' => 'Alasan pembatalan wajib diisi.',
        ]);

        DB::transaction(function () use ($encounter, $request) {
            $encounter->update([
                'status' => 'cancelled',
                'cancellation_reason' => $request->reason,
            ]);

            $encounter->queues()->update(['status' => 'done']);

            $encounter->invoice?->update(['status' => 'void', 'void_reason' => 'Kunjungan dibatalkan']);
        });

        return redirect()->route('encounters.index')->with('success', 'Kunjungan berhasil dibatalkan.');
    }
}
