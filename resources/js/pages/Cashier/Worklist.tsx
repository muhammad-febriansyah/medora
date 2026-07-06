import { Head, Link, usePage, usePoll } from '@inertiajs/react';
import { Banknote } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Encounter = {
    id: number; uuid: string;
    patient: { id: number; name: string; medical_record_number: string };
    department: { id: number; name: string } | null;
    invoice: { id: number; invoice_number: string; total: number; items: { id: number; item_name_snapshot: string; line_total: number }[] } | null;
};

function formatRupiah(v: number): string {
    return `Rp ${v.toLocaleString('id-ID')}`;
}

export default function CashierWorklist() {
    const { encounters } = usePage().props as unknown as {
        encounters: { data: Encounter[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    };
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString('id-ID'));
    usePoll(5000, { only: ['encounters'], onSuccess: () => setLastUpdate(new Date().toLocaleTimeString('id-ID')) });

    return (
        <>
            <Head title="Kasir" />
            <AppLayout title="Kasir — Daftar Pembayaran">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">{encounters.total} kunjungan siap dibayar</h2>
                        <p className="text-xs text-muted-foreground">Diperbarui {lastUpdate}</p>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Poli</TableHead>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {encounters.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Tidak ada kunjungan menunggu pembayaran.</TableCell>
                                        </TableRow>
                                    ) : (
                                        encounters.data.map((e) => (
                                            <TableRow key={e.id}>
                                                <TableCell>
                                                    <Link href={`/patients/${e.patient.id}`} className="font-medium">{e.patient.name}</Link>
                                                    <p className="text-xs text-muted-foreground">{e.patient.medical_record_number}</p>
                                                </TableCell>
                                                <TableCell>{e.department?.name ?? '-'}</TableCell>
                                                <TableCell className="font-mono text-sm">{e.invoice?.invoice_number ?? '-'}</TableCell>
                                                <TableCell className="text-right font-medium tabular-nums">{e.invoice ? formatRupiah(e.invoice.total) : '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/cashier/pay/${e.uuid}`} className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
                                                        <Banknote className="size-4" /> Bayar
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
