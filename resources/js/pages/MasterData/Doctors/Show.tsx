import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Doctor = {
    id: number;
    user: { id: number; name: string; email: string };
    sip_number: string; str_number: string; specialization: string | null;
    default_department: { id: number; name: string } | null;
    schedules: { id: number; day_of_week: number; start_time: string; end_time: string; quota: number | null; is_active: boolean; department: { id: number; name: string } }[];
    created_at: string;
};

const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DoctorsShow() {
    const { doctor } = usePage().props as unknown as { doctor: Doctor };

    return (
        <>
            <Head title={doctor.user.name} />
            <AppLayout title={`Detail Dokter: ${doctor.user.name}`}>
                <div className="max-w-3xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/doctors"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/doctors/${doctor.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                        </Button>
                    </div>

                    <Card className="mb-6">
                        <CardHeader><CardTitle>Informasi Dokter</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Nama</span>
                                <span className="font-medium">{doctor.user.name}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <span className="font-medium">{doctor.user.email}</span>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">SIP</span>
                                    <span className="font-medium">{doctor.sip_number}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">STR</span>
                                    <span className="font-medium">{doctor.str_number}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Spesialisasi</span>
                                <span className="font-medium">{doctor.specialization || '-'}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Poli Default</span>
                                {doctor.default_department ? <Badge variant="secondary">{doctor.default_department.name}</Badge> : <span>-</span>}
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Terdaftar</span>
                                <span className="font-medium">{formatDate(doctor.created_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>

                    {doctor.schedules.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle>Jadwal Praktik</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Hari</TableHead>
                                            <TableHead>Poli</TableHead>
                                            <TableHead>Jam</TableHead>
                                            <TableHead>Kuota</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {doctor.schedules.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell>{dayNames[s.day_of_week - 1]}</TableCell>
                                                <TableCell>{s.department.name}</TableCell>
                                                <TableCell>{s.start_time} - {s.end_time}</TableCell>
                                                <TableCell>{s.quota ?? '-'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={s.is_active ? 'default' : 'destructive'}>
                                                        {s.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
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
