<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\LabOrder;
use App\Models\LabOrderItem;
use App\Models\LabTest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LabOrderController extends Controller
{
    public function worklist(): Response
    {
        $orders = LabOrder::with([
            'encounter.patient:id,name,medical_record_number',
            'encounter.doctor.user:id,name',
            'items.labTest:id,name',
        ])
            ->whereIn('status', ['ordered', 'in_progress'])
            ->latest()
            ->get();

        return Inertia::render('Lab/Worklist', [
            'orders' => $orders,
        ]);
    }

    public function process(LabOrder $order): Response
    {
        $order->load([
            'encounter.patient:id,name,medical_record_number',
            'encounter.doctor.user:id,name',
            'items.labTest.parameters',
            'items.results',
        ]);

        return Inertia::render('Lab/Process', [
            'order' => $order,
        ]);
    }

    public function saveResult(LabOrderItem $item): Response|RedirectResponse
    {
        $item->load('labTest.parameters', 'results');

        return Inertia::render('Lab/ResultForm', [
            'item' => $item,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'encounter_id' => ['required', 'exists:encounters,id'],
            'lab_test_id' => ['required', 'exists:lab_tests,id'],
        ]);

        $encounter = Encounter::findOrFail($request->encounter_id);
        $labTest = LabTest::findOrFail($request->lab_test_id);

        DB::transaction(function () use ($encounter, $labTest) {
            $order = $encounter->labOrders()->create([
                'status' => 'ordered',
                'ordered_by' => auth()->id(),
            ]);

            $order->items()->create([
                'lab_test_id' => $labTest->id,
                'test_name_snapshot' => $labTest->name,
                'price_snapshot' => $labTest->price,
            ]);

            if ($encounter->invoice) {
                $encounter->invoice->items()->create([
                    'category' => 'lab',
                    'item_name_snapshot' => $labTest->name,
                    'unit_price_snapshot' => $labTest->price,
                    'quantity' => 1,
                    'line_total' => $labTest->price,
                    'reference_type' => 'lab_order_item',
                    'reference_id' => $order->items()->first()?->id,
                ]);
            }

            $encounter->update(['status' => 'waiting_lab']);
        });

        return back()->with('success', 'Order lab berhasil dibuat.');
    }
}
