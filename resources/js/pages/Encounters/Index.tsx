import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, MoreHorizontal, Plus } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Encounter = {
    id: number; uuid: string; encounter_date: string; visit_type: string;
    payer_type: string; status: string;
    patient: { id: number; name: string; medical_record_number: string };
    department: { id: number; name: string } | null;
    doctor: { user: { id: number; name: string } } | null;
};

type Department = { id: number; name: string };

const statusBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    registered: 'secondary',
    nurse_assessment: 'secondary',
    in_consultation: 'default',
    waiting_lab: 'outline',
    in_pharmacy: 'outline',
    waiting_payment: 'outline',
    completed: 'outline',
    cancelled: 'destructive',
};

const statusLabel: Record<string, string> = {
    registered: 'Terdaftar',
    nurse_assessment: 'Asesmen Perawat',
    in_consultation: 'Konsultasi',
    waiting_lab: 'Menunggu Lab',
    in_pharmacy: 'Farmasi',
    waiting_payment: 'Menunggu Bayar',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function EncountersIndex() {
    const { encounters, departments, filters } = usePage().props as unknown as {
        encounters: { data: Encounter[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        departments: Department[];
        filters: { search: string; date: string; department_id: string; status: string };
    };

    function goTo(value: string, param: string) {
        const params = new URLSearchParams(window.location.search);
        params.set(param, value);
        if (!value) params.delete(param);
        window.location.href = `/encounters?${params.toString()}`;
    }

    return (
        <>
            <Head title="Kunjungan" />
            <AppLayout title="Data Kunjungan">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Input
                                type="search"
                                placeholder="Cari pasien atau no. RM..."
                                defaultValue={filters.search}
                                className="max-w-xs"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length >= 2 || value.length === 0) {
                                        goTo(value, 'search');
                                    }
                                }}
                            />
                            <Input
                                type="date"
                                defaultValue={filters.date}
                                className="max-w-[140px]"
                                onChange={(e) => goTo(e.target.value, 'date')}
                            />
                            <Select
                                value={filters.department_id || 'all'}
                                onValueChange={(v) => goTo(v === 'all' ? '' : v, 'department_id')}
                            >
                                <SelectTrigger className="w-36"><SelectValue placeholder="Semua Poli" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Poli</SelectItem>
                                    {departments.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(v) => goTo(v === 'all' ? '' : v, 'status')}
                            >
                                <SelectTrigger className="w-40"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    {Object.entries(statusLabel).map(([k, v]) => (
                                        <SelectItem key={k} value={k}>{v}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild>
                            <Link href="/encounters/create">
                                <Plus className="size-4" /> Registrasi Kunjungan
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No. RM</TableHead>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Poli</TableHead>
                                        <TableHead>Dokter</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {encounters.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                                Belum ada data kunjungan. <Link href="/encounters/create" className="font-medium text-primary underline">Registrasi Kunjungan</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        encounters.data.map((e) => (
                                            <TableRow key={e.id}>
                                                <TableCell className="font-mono">{e.patient.medical_record_number}</TableCell>
                                                <TableCell className="font-medium">
                                                    <Link href={`/patients/${e.patient.id}`}>{e.patient.name}</Link>
                                                </TableCell>
                                                <TableCell>{e.department?.name ?? '-'}</TableCell>
                                                <TableCell>{e.doctor?.user.name ?? '-'}</TableCell>
                                                <TableCell>{new Date(e.encounter_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{e.visit_type === 'new' ? 'Baru' : 'Kontrol'}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusBadge[e.status] ?? 'secondary'}>{statusLabel[e.status] ?? e.status}</Badge>
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
                                                                <Link href={`/encounters/${e.uuid}`}><Eye className="size-4" /> Lihat</Link>
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

                    {encounters.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {encounters.from}–{encounters.to} dari {encounters.total} kunjungan
                            </p>
                            <div className="flex gap-1">
                                {encounters.links.map((link, i) => (
                                    <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} asChild={!!link.url}>
                                        {link.url ? <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
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
