import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Department = { id: number; name: string; queue_code: string; is_active: boolean; created_at: string; updated_at: string };

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DepartmentsShow() {
    const { department } = usePage().props as unknown as { department: Department };

    return (
        <>
            <Head title={department.name} />
            <AppLayout title={`Detail Poli: ${department.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/departments"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/departments/${department.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>{department.name}</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Kode Antrian</span>
                                <Badge variant="outline" className="w-fit text-lg">{department.queue_code}</Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={department.is_active ? 'default' : 'destructive'}>
                                    {department.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Dibuat</span>
                                <span className="font-medium">{formatDate(department.created_at)} WIB</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Diperbarui</span>
                                <span className="font-medium">{formatDate(department.updated_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
