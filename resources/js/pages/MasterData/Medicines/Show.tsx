import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Medicine = { id: number; name: string; generic_name: string | null; unit: string; dosage_form: string | null; selling_price: number; stock_quantity: number; minimum_stock: number; is_active: boolean; created_at: string; updated_at: string };

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatRupiah(val: number): string {
    return `Rp ${val.toLocaleString('id-ID')}`;
}

export default function MedicinesShow() {
    const { medicine } = usePage().props as unknown as { medicine: Medicine };

    return (
        <>
            <Head title={medicine.name} />
            <AppLayout title={`Detail Obat: ${medicine.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/medicines"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/medicines/${medicine.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>{medicine.name}</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {medicine.generic_name && (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">Nama Generik</span>
                                        <span className="font-medium">{medicine.generic_name}</span>
                                    </div>
                                    <Separator />
                                </>
                            )}
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Satuan / Sediaan</span>
                                <span className="font-medium">{medicine.unit}{medicine.dosage_form ? ` / ${medicine.dosage_form}` : ''}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Harga Jual</span>
                                <span className="text-lg font-semibold tabular-nums">{formatRupiah(medicine.selling_price)}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Stok</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold tabular-nums">{medicine.stock_quantity}</span>
                                    <Badge variant={medicine.stock_quantity <= medicine.minimum_stock ? 'destructive' : 'secondary'}>
                                        min: {medicine.minimum_stock}
                                    </Badge>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={medicine.is_active ? 'default' : 'destructive'}>{medicine.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Dibuat</span>
                                <span className="font-medium">{formatDate(medicine.created_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
