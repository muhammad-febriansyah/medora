import { Head, usePage, usePoll } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

type Department = { id: number; name: string };
type QueueEntry = { id: number; queue_number: string; status: string; encounter: { patient: { name: string } } } | null;
type PollingItem = {
    department: Department;
    called: QueueEntry;
    next: QueueEntry[];
};

declare global {
    interface Window {
        speechSynthesis: SpeechSynthesis;
    }
}

export default function DisplayIndex() {
    const { pollingData } = usePage().props as unknown as {
        pollingData: PollingItem[];
    };
    const [queueData, setQueueData] = useState(pollingData);
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    const [blinking, setBlinking] = useState<Record<string, boolean>>({});
    const previousCalled = useRef<Record<number, string | null>>({});

    usePoll(3000, {
        only: ['pollingData'],
        onSuccess: (page) => {
            const newData = page.props.pollingData as PollingItem[];
            setQueueData(newData);
            setLastUpdate(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

            newData.forEach((item) => {
                const prev = previousCalled.current[item.department.id];
                const curr = item.called?.queue_number ?? null;
                if (curr && curr !== prev) {
                    setBlinking((b) => ({ ...b, [String(item.department.id)]: true }));
                    setTimeout(() => setBlinking((b) => ({ ...b, [String(item.department.id)]: false })), 3000);
                    announce(item.department.name, curr);
                }
                previousCalled.current[item.department.id] = curr;
            });
        },
    });

    function announce(deptName: string, queueNumber: string) {
        if (!window.speechSynthesis) return;
        const dept = deptName.replace('Poli ', '');
        const num = queueNumber;
        const text = `Nomor antrian ${num}, silakan menuju ${dept}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    return (
        <>
            <Head title="Display Antrian" />
            <div className="min-h-screen bg-teal-950 text-white p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-2xl mx-auto">
                    {queueData.map((item) => {
                        const isBlinking = blinking[String(item.department.id)];
                        return (
                            <div key={item.department.id} className="text-center">
                                <h3 className="text-lg font-semibold mb-3 opacity-80">{item.department.name}</h3>
                                <div className={`text-8xl font-bold tabular-nums mb-4 ${isBlinking ? 'animate-pulse' : ''}`}>
                                    {item.called?.queue_number ?? '-'}
                                </div>
                                <div className="space-y-1 text-base opacity-60">
                                    <p className="text-sm font-medium uppercase tracking-wider mb-2">Berikutnya</p>
                                    {item.next.length > 0 ? (
                                        item.next.map((n) => (
                                            <p key={n!.id} className="tabular-nums">{n!.queue_number}</p>
                                        ))
                                    ) : (
                                        <p>-</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4 text-lg opacity-70 border-t border-teal-800">
                    <span>Medora RME</span>
                    <span className="tabular-nums">{lastUpdate} WIB</span>
                </div>
            </div>
        </>
    );
}
