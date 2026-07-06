<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CashierController extends Controller
{
    public function worklist(): Response
    {
        $encounters = Encounter::with([
            'patient:id,name,medical_record_number',
            'department:id,name',
            'invoice.items',
        ])
            ->where('status', 'waiting_payment')
            ->latest()
            ->paginate(15);

        return Inertia::render('Cashier/Worklist', [
            'encounters' => $encounters,
        ]);
    }

    public function process(Encounter $encounter): Response
    {
        $encounter->load([
            'patient:id,name,medical_record_number',
            'department:id,name',
            'invoice.items',
            'diagnoses.icd10Code',
        ]);

        return Inertia::render('Cashier/Process', [
            'encounter' => $encounter,
        ]);
    }

    public function pay(Request $request, Encounter $encounter): RedirectResponse
    {
        $invoice = $encounter->invoice;

        if (! $invoice) {
            return back()->with('error', 'Tidak ada invoice.');
        }

        $request->validate([
            'method' => ['required', 'in:cash,transfer,qris_static'],
            'amount' => ['required', 'integer', 'min:1'],
            'amount_tendered' => ['nullable', 'integer', 'required_if:method,cash'],
        ], [
            'method.required' => 'Metode bayar wajib dipilih.',
            'amount.required' => 'Jumlah bayar wajib diisi.',
            'amount_tendered.required_if' => 'Nominal tunai wajib diisi.',
        ]);

        $amount = (int) $request->amount;
        $change = 0;

        if ($request->method === 'cash' && $request->amount_tendered) {
            $change = (int) $request->amount_tendered - $amount;
            if ($change < 0) {
                return back()->with('error', 'Uang tunai kurang dari total.');
            }
        }

        DB::transaction(function () use ($invoice, $request, $encounter) {
            $invoice->update([
                'status' => 'paid',
                'total' => (int) $request->amount,
                'subtotal' => (int) $request->amount,
            ]);

            Payment::create([
                'invoice_id' => $invoice->id,
                'method' => $request->method,
                'amount' => (int) $request->amount,
                'amount_tendered' => $request->amount_tendered ? (int) $request->amount_tendered : null,
                'change_amount' => ($request->method === 'cash' && $request->amount_tendered) ? (int) $request->amount_tendered - (int) $request->amount : null,
                'received_by' => auth()->id(),
                'paid_at' => now(),
            ]);

            $encounter->update(['status' => 'completed', 'completed_at' => now()]);
        });

        return redirect()->route('cashier.worklist')->with('success', 'Pembayaran berhasil.');
    }
}
