import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/components/shared/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AccessLogs() {
    const { logs } = usePage().props as unknown as {
        logs: { data: { id: number; user: { id: number; name: string } | null; patient: { id: number; name: string; medical_record_number: string } | null; encounter_id: number | null; context: string; is_break_the_glass: boolean; accessed_at: string }[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    };

    return (
        <>
            <Head title="Access Log" />
            <AppLayout title="Access Log Rekam Medis">
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Pasien</TableHead>
                                    <TableHead>Konteks</TableHead>
                                    <TableHead>BTG</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada access log.</TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((l) => (
                                        <TableRow key={l.id}>
                                            <TableCell className="text-xs">
                                                {new Date(l.accessed_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                            <TableCell>{l.user?.name ?? '-'}</TableCell>
                                            <TableCell>
                                                {l.patient ? (
                                                    <Link href={`/patients/${l.patient.id}`} className="font-mono text-sm">{l.patient.medical_record_number}</Link>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell className="text-xs">{l.context}</TableCell>
                                            <TableCell>
                                                {l.is_break_the_glass && <Badge variant="destructive">BTG</Badge>}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </AppLayout>
        </>
    );
}
