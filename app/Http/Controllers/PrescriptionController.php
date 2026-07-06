<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\Medicine;
use App\Models\Prescription;
use App\Models\Queue;
use App\Models\StockMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PrescriptionController extends Controller
{
    public function worklist(Request $request): Response
    {
        $prescriptions = Prescription::with([
            'encounter.patient:id,name,medical_record_number',
            'encounter.department:id,name',
            'items.medicine:id,name',
        ])
            ->whereIn('status', ['submitted', 'verified', 'flagged'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Pharmacy/Worklist', [
            'prescriptions' => $prescriptions,
        ]);
    }

    public function review(Prescription $prescription): Response
    {
        $prescription->load([
            'encounter.patient:id,name,medical_record_number,allergies',
            'encounter.department:id,name',
            'encounter.doctor.user:id,name',
            'items.medicine:id,name,unit,stock_quantity,selling_price',
        ]);

        return Inertia::render('Pharmacy/Review', [
            'prescription' => $prescription,
        ]);
    }

    public function verify(Prescription $prescription): RedirectResponse
    {
        $prescription->update([
            'status' => 'verified',
            'verified_by' => auth()->id(),
        ]);

        return back()->with('success', 'Resep berhasil diverifikasi.');
    }

    public function flag(Request $request, Prescription $prescription): RedirectResponse
    {
        $request->validate(['notes' => ['required', 'string', 'max:500']]);

        $prescription->update([
            'status' => 'flagged',
            'flag_notes' => $request->notes,
        ]);

        return back()->with('warning', 'Resep ditandai bermasalah.');
    }

    public function dispense(Prescription $prescription): RedirectResponse
    {
        DB::transaction(function () use ($prescription) {
            foreach ($prescription->items as $item) {
                Medicine::where('id', $item->medicine_id)->decrement('stock_quantity', $item->quantity);

                StockMovement::create([
                    'medicine_id' => $item->medicine_id,
                    'type' => 'out',
                    'quantity' => -$item->quantity,
                    'reference_type' => 'prescription_item',
                    'reference_id' => $item->id,
                    'created_by' => auth()->id(),
                ]);
            }

            $prescription->update([
                'status' => 'dispensed',
                'dispensed_by' => auth()->id(),
                'dispensed_at' => now(),
            ]);
        });

        return back()->with('success', 'Obat berhasil di-dispensing.');
    }

    public function handOver(Prescription $prescription): RedirectResponse
    {
        $prescription->update(['status' => 'handed_over']);

        return back()->with('success', 'Obat diserahkan ke pasien.');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'encounter_id' => ['required', 'exists:encounters,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.medicine_id' => ['required', 'exists:medicines,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.dosage' => ['required', 'string', 'max:50'],
            'items.*.instruction' => ['nullable', 'string', 'max:255'],
            'items.*.is_racikan' => ['boolean'],
        ], [
            'items.required' => 'Minimal satu obat harus dipilih.',
            'items.*.dosage.required' => 'Dosis wajib diisi.',
        ]);

        $encounter = Encounter::findOrFail($request->encounter_id);

        DB::transaction(function () use ($request, $encounter) {
            $prescription = $encounter->prescriptions()->create(['status' => 'submitted']);

            foreach ($request->items as $itemData) {
                $medicine = Medicine::findOrFail($itemData['medicine_id']);

                $prescription->items()->create([
                    'medicine_id' => $medicine->id,
                    'medicine_name_snapshot' => $medicine->name,
                    'price_snapshot' => $medicine->selling_price,
                    'quantity' => (int) $itemData['quantity'],
                    'dosage' => $itemData['dosage'],
                    'instruction' => $itemData['instruction'] ?? null,
                    'is_racikan' => (bool) ($itemData['is_racikan'] ?? false),
                ]);

                if ($encounter->invoice) {
                    $encounter->invoice->items()->create([
                        'category' => 'medicine',
                        'item_name_snapshot' => $medicine->name,
                        'unit_price_snapshot' => $medicine->selling_price,
                        'quantity' => (int) $itemData['quantity'],
                        'line_total' => $medicine->selling_price * (int) $itemData['quantity'],
                        'reference_type' => 'prescription_item',
                        'reference_id' => $prescription->items()->latest()->first()?->id,
                    ]);
                }
            }

            $encounter->update(['status' => 'in_pharmacy']);

            Queue::create([
                'encounter_id' => $encounter->id,
                'queue_type' => 'pharmacy',
                'department_id' => $encounter->department_id,
                'queue_number' => 'RX-'.str_pad((string) (Queue::where('queue_type', 'pharmacy')->whereDate('queue_date', now())->count() + 1), 3, '0', STR_PAD_LEFT),
                'sequence' => Queue::where('queue_type', 'pharmacy')->whereDate('queue_date', now())->max('sequence') + 1 ?? 1,
                'queue_date' => now(),
                'status' => 'waiting',
            ]);
        });

        return back()->with('success', 'Resep berhasil dibuat dan dikirim ke farmasi.');
    }

    public function searchMedicine(Request $request): JsonResponse
    {
        $medicines = Medicine::where('is_active', true)
            ->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%")
                    ->orWhere('generic_name', 'like', "%{$request->q}%");
            })
            ->limit(20)
            ->get(['id', 'name', 'unit', 'stock_quantity', 'selling_price']);

        return response()->json($medicines);
    }
}
