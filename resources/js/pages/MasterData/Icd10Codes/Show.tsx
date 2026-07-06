import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Icd10Code = { id: number; code: string; description_en: string; description_id: string | null; created_at: string };

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Icd10CodesShow() {
    const { code } = usePage().props as unknown as { code: Icd10Code };

    return (
        <>
            <Head title={code.code} />
            <AppLayout title={`Detail Kode: ${code.code}`}>
                <div className="max-w-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/icd10-codes"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/icd10-codes/${code.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline" className="text-lg">{code.code}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Deskripsi (Indonesia)</span>
                                <span className="font-medium">{code.description_id || '-'}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Deskripsi (English)</span>
                                <span className="font-medium">{code.description_en}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Dibuat</span>
                                <span className="font-medium">{formatDate(code.created_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
