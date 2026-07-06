import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function LabProcess() {
    const { order } = usePage().props as unknown as { order: any };

    return (
        <>
            <Head title="Proses Lab" />
            <AppLayout title="Proses Order Lab">
                <div className="max-w-3xl">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/lab/worklist"><ArrowLeft className="size-4" /> Kembali</Link>
                    </Button>
                    <Card>
                        <CardHeader>
                            <CardTitle>{order.encounter.patient.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {order.encounter.patient.medical_record_number} · dr. {order.encounter.doctor?.user.name}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {order.items.map((item: any) => (
                                <div key={item.id} className="mb-6">
                                    <h3 className="font-medium mb-2">{item.lab_test?.name}</h3>
                                    {item.lab_test?.parameters?.length > 0 && (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Parameter</TableHead>
                                                    <TableHead>Satuan</TableHead>
                                                    <TableHead>Rentang Normal</TableHead>
                                                    <TableHead>Hasil</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {item.lab_test.parameters.map((p: any) => {
                                                    const result = item.results?.find((r: any) => r.lab_test_parameter_id === p.id);
                                                    return (
                                                        <TableRow key={p.id}>
                                                            <TableCell className="font-medium">{p.parameter_name}</TableCell>
                                                            <TableCell>{p.unit}</TableCell>
                                                            <TableCell>{p.normal_range_male || p.normal_range_female || '-'}</TableCell>
                                                            <TableCell>
                                                                {result ? (
                                                                    <span className="tabular-nums">
                                                                        {result.value} {result.unit_snapshot}
                                                                        <Badge variant={result.flag === 'high' ? 'destructive' : result.flag === 'low' ? 'outline' : 'secondary'} className="ml-2">
                                                                            {result.flag === 'high' ? 'H' : result.flag === 'low' ? 'L' : 'N'}
                                                                        </Badge>
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted-foreground italic">Belum diinput</span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" size="sm" disabled>
                                    Cetak Hasil Lab
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
