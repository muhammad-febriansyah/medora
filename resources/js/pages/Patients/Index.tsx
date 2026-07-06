import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type Patient = {
    id: number; medical_record_number: string; nik: string | null;
    name: string; birth_date: string; gender: string; phone: string; deleted_at: string | null;
};

export default function PatientsIndex() {
    const { patients, filters } = usePage().props as unknown as {
        patients: { data: Patient[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        filters: { search: string };
    };

    return (
        <>
            <Head title="Data Pasien" />
            <AppLayout title="Data Pasien">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="search"
                            placeholder="Cari no. RM, NIK, nama, atau telepon..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 2 || value.length === 0) {
                                    window.location.href = value
                                        ? `/patients?search=${encodeURIComponent(value)}`
                                        : '/patients';
                                }
                            }}
                        />
                        <Button asChild>
                            <Link href="/patients/create">
                                <Plus className="size-4" /> Daftar Pasien Baru
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No. RM</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Tgl Lahir</TableHead>
                                        <TableHead>JK</TableHead>
                                        <TableHead>Telepon</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {patients.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                Belum ada data pasien. <Link href="/patients/create" className="font-medium text-primary underline">Daftar Pasien Baru</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        patients.data.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-mono font-medium">
                                                    <Link href={`/patients/${p.id}`}>{p.medical_record_number}</Link>
                                                </TableCell>
                                                <TableCell>{p.name}</TableCell>
                                                <TableCell className="font-mono text-sm">{p.nik ?? '-'}</TableCell>
                                                <TableCell>{new Date(p.birth_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{p.gender === 'male' ? 'L' : 'P'}</Badge>
                                                </TableCell>
                                                <TableCell>{p.phone}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="size-8">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/patients/${p.id}`}><Eye className="size-4" /> Lihat</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/patients/${p.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                                                            </DropdownMenuItem>
                                                            {!p.deleted_at && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/patients/${p.id}`} method="delete" as="button" className="text-red-600">
                                                                        <Trash2 className="size-4" /> Hapus
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
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

                    {patients.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {patients.from}–{patients.to} dari {patients.total} pasien
                            </p>
                            <div className="flex gap-1">
                                {patients.links.map((link, i) => (
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
