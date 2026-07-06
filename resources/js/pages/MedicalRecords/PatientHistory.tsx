import { Head, Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Patient = { id: number; name: string; medical_record_number: string; birth_date: string; gender: string };
type Encounter = {
    id: number; uuid: string; encounter_date: string; status: string; visit_type: string;
    department: { id: number; name: string } | null;
    doctor: { user: { id: number; name: string } } | null;
    diagnoses: { id: number; type: string; icd10_code: { id: number; code: string; description_id: string | null } }[];
    clinical_note: { id: number; status: string } | null;
};

export default function PatientHistory() {
    const { patient, encounters } = usePage().props as unknown as {
        patient: Patient | null;
        encounters: { data: Encounter[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    };
    const [rm, setRm] = useState('');

    function search() {
        if (rm) window.location.href = `/medical-records/patient-history?rm=${encodeURIComponent(rm)}`;
    }

    return (
        <>
            <Head title="Riwayat Pasien" />
            <AppLayout title="Riwayat Rekam Medis Pasien">
                <div className="max-w-4xl">
                    <div className="mb-6 flex items-end gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="Masukkan Nomor RM pasien..."
                                value={rm}
                                onChange={(e) => setRm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && search()}
                            />
                        </div>
                        <Button onClick={search}><Search className="size-4" /> Cari</Button>
                    </div>

                    {patient && (
                        <>
                            <Card className="mb-6">
                                <CardHeader className="pb-2">
                                    <CardTitle>{patient.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {patient.medical_record_number} · {patient.gender === 'male' ? 'L' : 'P'} · {new Date(patient.birth_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </CardHeader>
                            </Card>

                            <div className="space-y-3">
                                {encounters.data.length === 0 ? (
                                    <p className="text-muted-foreground">Tidak ada riwayat kunjungan.</p>
                                ) : (
                                    encounters.data.map((e) => (
                                        <Card key={e.id}>
                                            <CardContent className="py-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{new Date(e.encounter_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                                            <Badge variant="secondary">{e.visit_type === 'new' ? 'Baru' : 'Kontrol'}</Badge>
                                                            <Badge variant="outline">{e.department?.name}</Badge>
                                                        </div>
                                                        {e.doctor && <p className="text-sm text-muted-foreground">dr. {e.doctor.user.name}</p>}
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {e.diagnoses.map((d) => (
                                                                <Badge key={d.id} variant={d.type === 'primary' ? 'default' : 'secondary'}>
                                                                    {d.icd10_code.code} {d.icd10_code.description_id}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {e.clinical_note ? (
                                                            <Badge variant={e.clinical_note.status === 'final' ? 'default' : 'outline'}>
                                                                {e.clinical_note.status === 'final' ? 'Final 🔒' : 'Draft'}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="destructive">Belum Dicatat</Badge>
                                                        )}
                                                        <Link href={`/encounters/${e.uuid}`} className="text-sm text-primary">Detail</Link>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {!patient && <p className="text-muted-foreground">Cari pasien untuk melihat riwayat rekam medis.</p>}
                </div>
            </AppLayout>
        </>
    );
}
