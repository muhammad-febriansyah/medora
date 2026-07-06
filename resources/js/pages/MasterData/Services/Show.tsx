import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Service = { id: number; name: string; category: string; icd9cm_code: string | null; price: number; is_active: boolean; created_at: string; updated_at: string };

const categoryLabels: Record<string, string> = { consultation: 'Konsultasi', procedure: 'Tindakan', administration: 'Administrasi', lab: 'Lab' };

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatRupiah(val: number): string {
    return `Rp ${val.toLocaleString('id-ID')}`;
}

export default function ServicesShow() {
    const { service } = usePage().props as unknown as { service: Service };

    return (
        <>
            <Head title={service.name} />
            <AppLayout title={`Detail Layanan: ${service.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/services"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/services/${service.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>{service.name}</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Kategori</span>
                                <Badge variant="secondary">{categoryLabels[service.category] ?? service.category}</Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Kode ICD-9-CM</span>
                                <span className="font-medium">{service.icd9cm_code || '-'}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Tarif</span>
                                <span className="text-lg font-semibold tabular-nums">{formatRupiah(service.price)}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={service.is_active ? 'default' : 'destructive'}>{service.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Dibuat</span>
                                <span className="font-medium">{formatDate(service.created_at)} WIB</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Diperbarui</span>
                                <span className="font-medium">{formatDate(service.updated_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
