<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function index(Request $request): Response
    {
        $medicines = Medicine::when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $critical = Medicine::where('is_active', true)
            ->whereColumn('stock_quantity', '<=', 'minimum_stock')
            ->count();

        return Inertia::render('Pharmacy/Stock', [
            'medicines' => $medicines,
            'filters' => ['search' => $request->search],
            'critical' => $critical,
        ]);
    }

    public function stockIn(Request $request): RedirectResponse
    {
        $request->validate([
            'medicine_id' => ['required', 'exists:medicines,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_cost' => ['nullable', 'integer', 'min:0'],
            'expired_date' => ['nullable', 'date'],
        ]);

        $medicine = Medicine::findOrFail($request->medicine_id);

        StockMovement::create([
            'medicine_id' => $medicine->id,
            'type' => 'in',
            'quantity' => (int) $request->quantity,
            'unit_cost' => $request->unit_cost,
            'expired_date' => $request->expired_date,
            'created_by' => auth()->id(),
        ]);

        $medicine->increment('stock_quantity', (int) $request->quantity);

        return back()->with('success', 'Stok berhasil ditambahkan.');
    }

    public function adjust(Request $request): RedirectResponse
    {
        $request->validate([
            'medicine_id' => ['required', 'exists:medicines,id'],
            'quantity' => ['required', 'integer', 'not_in:0'],
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $medicine = Medicine::findOrFail($request->medicine_id);
        $qty = (int) $request->quantity;

        StockMovement::create([
            'medicine_id' => $medicine->id,
            'type' => 'adjustment',
            'quantity' => $qty,
            'reason' => $request->reason,
            'created_by' => auth()->id(),
        ]);

        $medicine->increment('stock_quantity', $qty);

        return back()->with('success', 'Stok berhasil disesuaikan.');
    }
}
