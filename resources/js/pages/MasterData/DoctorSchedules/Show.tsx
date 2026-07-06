import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Doctor = { id: number; user: { id: number; name: string } };
type Schedule = {
    id: number; day_of_week: number; start_time: string; end_time: string;
    quota: number | null; is_active: boolean;
    doctor: { user: { id: number; name: string } };
    department: { id: number; name: string } | null;
    created_at: string;
};

const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DoctorSchedulesShow() {
    const { doctor, schedule } = usePage().props as unknown as {
        doctor: Doctor;
        schedule: Schedule;
    };

    return (
        <>
            <Head title={`Detail Jadwal ${doctor.user.name}`} />
            <AppLayout title={`Detail Jadwal: ${doctor.user.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/doctors/${doctor.id}/schedules`}>
                                <ArrowLeft className="size-4" /> Kembali
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/doctors/${doctor.id}/schedules/${schedule.id}/edit`}>
                                <Pencil className="size-4" /> Edit
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Informasi Jadwal</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Dokter</span>
                                <span className="font-medium">{schedule.doctor.user.name}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Poli</span>
                                <span className="font-medium">{schedule.department?.name ?? '-'}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Hari</span>
                                <span className="font-medium">{dayNames[schedule.day_of_week - 1]}</span>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Jam Mulai</span>
                                    <span className="font-medium">{schedule.start_time}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Jam Selesai</span>
                                    <span className="font-medium">{schedule.end_time}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Kuota</span>
                                    <span className="font-medium">{schedule.quota ?? '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                                        {schedule.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Dibuat</span>
                                <span className="font-medium">{formatDate(schedule.created_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
