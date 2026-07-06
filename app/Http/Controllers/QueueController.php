<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Doctor;
use App\Models\Encounter;
use App\Models\Queue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QueueController extends Controller
{
    public function nurseWorklist(Request $request): Response
    {
        $user = auth()->user();
        $departmentId = $request->department_id;

        $queues = Queue::with('encounter.patient:id,name,medical_record_number,birth_date,gender')
            ->where('queue_type', 'poli')
            ->whereIn('status', ['waiting', 'called'])
            ->when($departmentId, fn ($q, $d) => $q->where('department_id', $d))
            ->whereDate('queue_date', now())
            ->orderBy('sequence')
            ->get();

        $departments = Department::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Nurse/Worklist', [
            'queues' => $queues,
            'departments' => $departments,
            'filters' => ['department_id' => $departmentId],
        ]);
    }

    public function doctorWorklist(Request $request): Response
    {
        $user = auth()->user();
        $doctor = Doctor::where('user_id', $user->id)->first();

        if (! $doctor) {
            return redirect()->route('dashboard')->with('error', 'Anda tidak terdaftar sebagai dokter.');
        }

        $encounters = Encounter::with(['patient:id,name,medical_record_number,birth_date,gender,allergies', 'department:id,name', 'queues' => fn ($q) => $q->where('queue_type', 'poli')->orderBy('created_at'), 'vitalSigns' => fn ($q) => $q->latest()])
            ->where('doctor_id', $doctor->id)
            ->whereIn('status', ['nurse_assessment', 'in_consultation', 'waiting_lab'])
            ->whereDate('encounter_date', now())
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Doctor/Worklist', [
            'encounters' => $encounters,
            'doctor' => $doctor->load('user:id,name'),
        ]);
    }

    public function call(Queue $queue): RedirectResponse
    {
        $queue->update(['status' => 'called', 'called_at' => now(), 'handled_by' => auth()->id()]);

        if ($queue->encounter && $queue->encounter->status === 'registered') {
            $queue->encounter->update(['status' => 'nurse_assessment']);
        }

        return back()->with('success', "Nomor antrian {$queue->queue_number} dipanggil.");
    }

    public function serve(Queue $queue): RedirectResponse
    {
        $queue->update(['status' => 'serving', 'served_at' => now(), 'handled_by' => auth()->id()]);

        return back()->with('success', "Mulai melayani {$queue->queue_number}.");
    }

    public function done(Queue $queue): RedirectResponse
    {
        $queue->update(['status' => 'done', 'finished_at' => now(), 'handled_by' => auth()->id()]);

        return back()->with('success', "Pelayanan {$queue->queue_number} selesai.");
    }

    public function skip(Queue $queue): RedirectResponse
    {
        $queue->update(['status' => 'skipped']);

        Queue::create([
            'encounter_id' => $queue->encounter_id,
            'queue_type' => 'poli',
            'department_id' => $queue->department_id,
            'queue_number' => $queue->queue_number,
            'sequence' => $queue->sequence,
            'queue_date' => $queue->queue_date,
            'status' => 'waiting',
        ]);

        return back()->with('warning', "Antrian {$queue->queue_number} dilewati.");
    }

    public function display(Request $request): Response
    {
        $pollingData = [];

        $departments = Department::where('is_active', true)->get();

        foreach ($departments as $dept) {
            $called = Queue::with('encounter.patient:id,name')
                ->where('queue_type', 'poli')
                ->where('department_id', $dept->id)
                ->whereDate('queue_date', now())
                ->where('status', 'called')
                ->latest('called_at')
                ->first();

            $waiting = Queue::with('encounter.patient:id,name')
                ->where('queue_type', 'poli')
                ->where('department_id', $dept->id)
                ->whereDate('queue_date', now())
                ->where('status', 'waiting')
                ->orderBy('sequence')
                ->limit(3)
                ->get();

            $pollingData[] = [
                'department' => $dept,
                'called' => $called,
                'next' => $waiting,
            ];
        }

        return Inertia::render('Display/Index', [
            'pollingData' => $pollingData,
        ]);
    }
}
