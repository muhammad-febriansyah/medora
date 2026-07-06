import { Head, Link, usePage, usePoll } from '@inertiajs/react';
import { Stethoscope } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import AllergyBanner from '@/components/shared/allergy-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Allergy = { id: number; allergen: string; severity: 'mild' | 'moderate' | 'severe' };
type QueueEntry = { id: number; queue_number: string; status: string };
type VitalSign = { id: number; systolic: number; diastolic: number; temperature: number; pulse: number; spo2: number };
type Encounter = {
    id: number; uuid: string; status: string;
    patient: { id: number; name: string; medical_record_number: string; birth_date: string; gender: string; allergies: Allergy[] };
    department: { id: number; name: string } | null;
    queues: QueueEntry[];
    vital_signs: VitalSign[];
    created_at: string;
};

function age(birthDate: string): number {
    const bd = new Date(birthDate);
    const today = new Date();
    let a = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
    return a;
}

const statusLabel: Record<string, string> = {
    nurse_assessment: 'Asesmen Selesai',
    in_consultation: 'Konsultasi',
    waiting_lab: 'Menunggu Lab',
};

export default function DoctorWorklist() {
    const { encounters } = usePage().props as unknown as {
        encounters: Encounter[];
    };
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('id-ID'));
    usePoll(5000, {
        only: ['encounters'],
        onSuccess: () => setLastUpdate(new Date().toLocaleTimeString('id-ID')),
    });

    return (
        <>
            <Head title="Worklist Dokter" />
            <AppLayout title="Worklist Dokter">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">
                            {encounters.length} pasien menunggu
                        </h2>
                        <p className="text-xs text-muted-foreground">Diperbarui {lastUpdate}</p>
                    </div>

                    {encounters.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                Tidak ada pasien menunggu.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {encounters.map((e) => {
                                const p = e.patient;
                                const qn = e.queues.find(q => q.queue_type === 'poli')?.queue_number ?? '-';
                                const vs = e.vital_signs[0];
                                return (
                                    <Card key={e.id}>
                                        <CardContent className="py-4">
                                            <AllergyBanner allergies={p.allergies} hasBeenChecked={p.allergies.length > 0} />
                                            <div className="mt-3 flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-bold tabular-nums text-primary">{qn}</span>
                                                        <Link href={`/patients/${p.id}`} className="font-medium">{p.name}</Link>
                                                        <span className="text-xs text-muted-foreground">
                                                            {p.medical_record_number} · {p.gender === 'male' ? 'L' : 'P'} · {age(p.birth_date)}th
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Badge variant="secondary">{statusLabel[e.status] ?? e.status}</Badge>
                                                        <Badge variant="outline">{e.department?.name}</Badge>
                                                        {vs && (
                                                            <span className="text-xs text-muted-foreground">
                                                                TD {vs.systolic}/{vs.diastolic} · N {vs.pulse} · S {vs.temperature}°C · SpO2 {vs.spo2}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/doctor/emr/${e.uuid}`}
                                                    className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                                                >
                                                    <Stethoscope className="size-4" /> Periksa
                                                </Link>
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
