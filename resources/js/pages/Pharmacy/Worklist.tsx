import { Head, Link, usePage, usePoll } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Prescription = {
    id: number; status: string; flag_notes: string | null;
    items: { id: number; medicine_name_snapshot: string; quantity: number }[];
    encounter: { patient: { id: number; name: string; medical_record_number: string }; department: { id: number; name: string } | null };
    created_at: string;
};

const statusBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    submitted: 'secondary',
    verified: 'default',
    flagged: 'destructive',
    dispensed: 'outline',
    handed_over: 'outline',
};

const statusLabel: Record<string, string> = {
    submitted: 'Diajukan',
    verified: 'Terverifikasi',
    flagged: 'Bermasalah',
    dispensed: 'Dispensing',
    handed_over: 'Diserahkan',
};

export default function PharmacyWorklist() {
    const { prescriptions } = usePage().props as unknown as {
        prescriptions: { data: Prescription[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    };
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('id-ID'));
    usePoll(5000, {
        only: ['prescriptions'],
        onSuccess: () => setLastUpdate(new Date().toLocaleTimeString('id-ID')),
    });

    return (
        <>
            <Head title="Antrian Resep" />
            <AppLayout title="Antrian Resep Farmasi">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">{prescriptions.total} resep dalam antrian</h2>
                        <p className="text-xs text-muted-foreground">Diperbarui {lastUpdate}</p>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Poli</TableHead>
                                        <TableHead>Obat</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prescriptions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Tidak ada resep dalam antrian.</TableCell>
                                        </TableRow>
                                    ) : (
                                        prescriptions.data.map((rx) => (
                                            <TableRow key={rx.id}>
                                                <TableCell>
                                                    <Link href={`/patients/${rx.encounter.patient.id}`} className="font-medium">{rx.encounter.patient.name}</Link>
                                                    <p className="text-xs text-muted-foreground">{rx.encounter.patient.medical_record_number}</p>
                                                </TableCell>
                                                <TableCell>{rx.encounter.department?.name ?? '-'}</TableCell>
                                                <TableCell className="text-sm">
                                                    {rx.items.slice(0, 3).map((i) => i.medicine_name_snapshot).join(', ')}
                                                    {rx.items.length > 3 && <span className="text-muted-foreground"> +{rx.items.length - 3}</span>}
                                                </TableCell>
                                                <TableCell><Badge variant={statusBadge[rx.status]}>{statusLabel[rx.status]}</Badge></TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/pharmacy/review/${rx.id}`} className="inline-flex items-center gap-1 text-sm text-primary">
                                                        <Eye className="size-4" /> Telaah
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
