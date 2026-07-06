import { Head, Link, usePage, usePoll } from '@inertiajs/react';
import { Megaphone, SkipForward, Play } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type QueueEntry = {
    id: number; queue_number: string; sequence: number; status: string; called_at: string | null;
    encounter: { patient: { id: number; name: string; medical_record_number: string; birth_date: string; gender: string } } | null;
};

type Department = { id: number; name: string };

function age(birthDate: string): number {
    const bd = new Date(birthDate);
    const today = new Date();
    let a = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
    return a;
}

export default function NurseWorklist() {
    const { queues, departments, filters } = usePage().props as unknown as {
        queues: QueueEntry[];
        departments: Department[];
        filters: { department_id: string };
    };

    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('id-ID'));
    usePoll(5000, {
        only: ['queues'],
        onSuccess: () => setLastUpdate(new Date().toLocaleTimeString('id-ID')),
    });

    return (
        <>
            <Head title="Worklist Perawat" />
            <AppLayout title="Worklist Perawat">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Select
                            value={filters.department_id || 'all'}
                            onValueChange={(v) => {
                                window.location.href = v === 'all' ? '/nurse/worklist' : `/nurse/worklist?department_id=${v}`;
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Semua Poli" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Poli</SelectItem>
                                {departments.map((d) => (
                                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Diperbarui {lastUpdate}</p>
                    </div>

                    {queues.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                Tidak ada antrian saat ini.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {queues.map((q) => {
                                const p = q.encounter?.patient;
                                return (
                                    <Card key={q.id} className={q.status === 'called' ? 'border-primary' : ''}>
                                        <CardContent className="flex items-center justify-between py-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl font-bold tabular-nums text-primary">{q.queue_number}</span>
                                                <div>
                                                    {p ? (
                                                        <>
                                                            <Link href={`/patients/${p.id}`} className="font-medium">{p.name}</Link>
                                                            <p className="text-xs text-muted-foreground">
                                                                {p.medical_record_number} · {p.gender === 'male' ? 'L' : 'P'} · {age(p.birth_date)}th
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </div>
                                                <Badge variant={q.status === 'called' ? 'default' : 'secondary'}>
                                                    {q.status === 'waiting' ? 'Menunggu' : 'Dipanggil'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {q.status === 'waiting' && (
                                                    <>
                                                        <Link
                                                            href={`/queues/${q.id}/call`}
                                                            method="post"
                                                            as="button"
                                                            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
                                                        >
                                                            <Megaphone className="size-4" /> Panggil
                                                        </Link>
                                                        <Link
                                                            href={`/queues/${q.id}/skip`}
                                                            method="post"
                                                            as="button"
                                                            className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
                                                        >
                                                            <SkipForward className="size-4" /> Lewati
                                                        </Link>
                                                    </>
                                                )}
                                                {q.status === 'called' && (
                                                    <>
                                                        <Link
                                                            href={`/nurse/assessment/${q.encounter_id}`}
                                                            className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                                                        >
                                                            <Play className="size-4" /> Mulai Asesmen
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
