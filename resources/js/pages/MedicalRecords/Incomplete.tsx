import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Encounter = {
    id: number; uuid: string; encounter_date: string; status: string;
    patient: { id: number; name: string; medical_record_number: string };
    department: { id: number; name: string } | null;
    clinical_note: { id: number; status: string } | null;
    diagnoses: { id: number; type: string }[];
};

export default function IncompleteEncounters() {
    const { encounters } = usePage().props as unknown as {
        encounters: { data: Encounter[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    };

    return (
        <>
            <Head title="Audit Kelengkapan" />
            <AppLayout title="Audit Kelengkapan Rekam Medis">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        Kunjungan 7 hari terakhir dengan dokumentasi belum lengkap.
                    </p>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Poli</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Masalah</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {encounters.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Semua dokumentasi lengkap.</TableCell>
                                        </TableRow>
                                    ) : (
                                        encounters.data.map((e) => {
                                            const issues: string[] = [];
                                            if (!e.clinical_note || e.clinical_note.status !== 'final') issues.push('SOAP belum final');
                                            if (!e.diagnoses.some(d => d.type === 'primary')) issues.push('Tanpa diagnosa utama');
                                            return (
                                                <TableRow key={e.id}>
                                                    <TableCell>
                                                        <Link href={`/patients/${e.patient.id}`} className="font-medium">{e.patient.name}</Link>
                                                        <p className="text-xs text-muted-foreground">{e.patient.medical_record_number}</p>
                                                    </TableCell>
                                                    <TableCell>{e.department?.name ?? '-'}</TableCell>
                                                    <TableCell>{new Date(e.encounter_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</TableCell>
                                                    <TableCell><Badge variant="secondary">{e.status}</Badge></TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm text-red-600">
                                                            <AlertTriangle className="size-3" />
                                                            {issues.join(', ')}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
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
