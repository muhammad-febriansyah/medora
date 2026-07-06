<?php

namespace App\Http\Controllers;

use App\Models\Encounter;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Queue;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();

        $stats = [
            'visitsToday' => Encounter::whereDate('encounter_date', $today)->count(),
            'revenueToday' => Payment::whereDate('paid_at', $today)->sum('amount'),
            'waitingQueue' => Queue::where('queue_type', 'poli')->whereDate('queue_date', $today)->whereIn('status', ['waiting', 'called'])->count(),
            'criticalStock' => Medicine::where('is_active', true)->whereColumn('stock_quantity', '<=', 'minimum_stock')->count(),
            'newPatientsToday' => Patient::whereDate('created_at', $today)->count(),
        ];

        $visitsByDepartment = Encounter::whereDate('encounter_date', $today)
            ->with('department:id,name')
            ->get()
            ->groupBy('department.name')
            ->map(fn ($g) => $g->count());

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'visitsByDepartment' => $visitsByDepartment,
        ]);
    }
}
