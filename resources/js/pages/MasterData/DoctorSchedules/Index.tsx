import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Plus, Trash2, ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Doctor = { id: number; user: { id: number; name: string } };

type Schedule = {
    id: number; day_of_week: number; start_time: string; end_time: string;
    quota: number | null; is_active: boolean;
    department: { id: number; name: string } | null;
    created_at: string;
};

const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function DoctorSchedulesIndex() {
    const { doctor, schedules } = usePage().props as unknown as {
        doctor: Doctor;
        schedules: { data: Schedule[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
    };

    return (
        <>
            <Head title={`Jadwal ${doctor.user.name}`} />
            <AppLayout title={`Jadwal Dokter: ${doctor.user.name}`}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/doctors"><ArrowLeft className="size-4" /> Kembali ke Data Dokter</Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/doctors/${doctor.id}/schedules/create`}>
                                <Plus className="size-4" /> Tambah Jadwal
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hari</TableHead>
                                        <TableHead>Poli</TableHead>
                                        <TableHead>Jam</TableHead>
                                        <TableHead>Kuota</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schedules.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                Belum ada jadwal. <Link href={`/doctors/${doctor.id}/schedules/create`} className="font-medium text-primary underline">Tambah Jadwal</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        schedules.data.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell className="font-medium">{dayNames[s.day_of_week - 1]}</TableCell>
                                                <TableCell>{s.department?.name ?? '-'}</TableCell>
                                                <TableCell>{s.start_time} – {s.end_time}</TableCell>
                                                <TableCell>{s.quota ?? '-'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={s.is_active ? 'default' : 'secondary'}>
                                                        {s.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="size-8">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/doctors/${doctor.id}/schedules/${s.id}`}>
                                                                    <Eye className="size-4" /> Lihat
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/doctors/${doctor.id}/schedules/${s.id}/edit`}>
                                                                    <Pencil className="size-4" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={`/doctors/${doctor.id}/schedules/${s.id}`}
                                                                    method="delete" as="button"
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="size-4" /> Hapus
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {schedules.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {schedules.from}–{schedules.to} dari {schedules.total} jadwal
                            </p>
                            <div className="flex gap-1">
                                {schedules.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                    >
                                        {link.url
                                            ? <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                            : <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        }
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
