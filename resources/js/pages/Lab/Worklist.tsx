import { Head, Link, usePage, usePoll } from '@inertiajs/react';
import { FlaskConical } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type LabOrder = {
    id: number; status: string;
    encounter: { patient: { id: number; name: string; medical_record_number: string }; doctor: { user: { id: number; name: string } } | null };
    items: { id: number; lab_test: { id: number; name: string } | null }[];
    created_at: string;
};

const statusLabel: Record<string, string> = { ordered: 'Dipesan', in_progress: 'Diproses', resulted: 'Hasil Selesai' };

export default function LabWorklist() {
    const { orders } = usePage().props as unknown as { orders: LabOrder[] };
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('id-ID'));
    usePoll(5000, { only: ['orders'], onSuccess: () => setLastUpdate(new Date().toLocaleTimeString('id-ID')) });

    return (
        <>
            <Head title="Worklist Lab" />
            <AppLayout title="Worklist Laboratorium">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">{orders.length} order lab menunggu</h2>
                        <p className="text-xs text-muted-foreground">Diperbarui {lastUpdate}</p>
                    </div>
                    {orders.length === 0 ? (
                        <Card><CardContent className="py-12 text-center text-muted-foreground">Tidak ada order lab.</CardContent></Card>
                    ) : (
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Pasien</TableHead>
                                            <TableHead>Dokter</TableHead>
                                            <TableHead>Pemeriksaan</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((o) => (
                                            <TableRow key={o.id}>
                                                <TableCell>
                                                    <Link href={`/patients/${o.encounter.patient.id}`} className="font-medium">{o.encounter.patient.name}</Link>
                                                    <p className="text-xs text-muted-foreground">{o.encounter.patient.medical_record_number}</p>
                                                </TableCell>
                                                <TableCell>{o.encounter.doctor?.user.name ?? '-'}</TableCell>
                                                <TableCell className="text-sm">{o.items.map((i) => i.lab_test?.name ?? '-').join(', ')}</TableCell>
                                                <TableCell><Badge variant="secondary">{statusLabel[o.status]}</Badge></TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/lab/${o.id}/process`} className="text-primary text-sm">
                                                        <FlaskConical className="size-4 inline" /> Proses
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
