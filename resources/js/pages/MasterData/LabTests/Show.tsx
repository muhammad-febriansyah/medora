import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type LabTest = {
    id: number; name: string; price: number; is_active: boolean; created_at: string;
    parameters: { id: number; parameter_name: string; unit: string | null; normal_range_male: string | null; normal_range_female: string | null }[];
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatRupiah(val: number): string {
    return `Rp ${val.toLocaleString('id-ID')}`;
}

export default function LabTestsShow() {
    const { labTest } = usePage().props as unknown as { labTest: LabTest };

    return (
        <>
            <Head title={labTest.name} />
            <AppLayout title={`Detail Pemeriksaan: ${labTest.name}`}>
                <div className="max-w-3xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/lab-tests"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/lab-tests/${labTest.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardHeader><CardTitle>{labTest.name}</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Tarif</span>
                                <span className="text-lg font-semibold tabular-nums">{formatRupiah(labTest.price)}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={labTest.is_active ? 'default' : 'destructive'}>{labTest.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Dibuat</span>
                                <span className="font-medium">{formatDate(labTest.created_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>

                    {labTest.parameters.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Parameter ({labTest.parameters.length})</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Parameter</TableHead>
                                            <TableHead>Satuan</TableHead>
                                            <TableHead>Normal (L)</TableHead>
                                            <TableHead>Normal (P)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {labTest.parameters.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-medium">{p.parameter_name}</TableCell>
                                                <TableCell>{p.unit || '-'}</TableCell>
                                                <TableCell>{p.normal_range_male || '-'}</TableCell>
                                                <TableCell>{p.normal_range_female || '-'}</TableCell>
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
