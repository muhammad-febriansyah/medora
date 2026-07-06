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

type Doctor = {
    id: number; user: { id: number; name: string; email: string };
    sip_number: string; str_number: string; specialization: string | null;
    default_department: { id: number; name: string } | null;
    deleted_at: string | null;
};

export default function DoctorsIndex() {
    const { doctors, filters } = usePage().props as unknown as {
        doctors: { data: Doctor[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        filters: { search: string };
    };

    return (
        <>
            <Head title="Data Dokter" />
            <AppLayout title="Data Dokter">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="search"
                            placeholder="Cari nama atau spesialisasi..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 2 || value.length === 0) {
                                    window.location.href = value
                                        ? `/doctors?search=${encodeURIComponent(value)}`
                                        : '/doctors';
                                }
                            }}
                        />
                        <Button asChild>
                            <Link href="/doctors/create">
                                <Plus className="size-4" />
                                Tambah Dokter
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Spesialisasi</TableHead>
                                        <TableHead>Poli Default</TableHead>
                                        <TableHead>SIP</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {doctors.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                Belum ada data dokter. <Link href="/doctors/create" className="font-medium text-primary underline">Tambah Dokter</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        doctors.data.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/doctors/${doc.id}`}>{doc.user.name}</Link>
                                                    <span className="ml-1 text-xs text-muted-foreground">({doc.user.email})</span>
                                                </TableCell>
                                                <TableCell>{doc.specialization || '-'}</TableCell>
                                                <TableCell>
                                                    {doc.default_department ? <Badge variant="secondary">{doc.default_department.name}</Badge> : '-'}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">{doc.sip_number}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="size-8">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/doctors/${doc.id}`}><Eye className="size-4" /> Lihat</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/doctors/${doc.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                                                            </DropdownMenuItem>
                                                            {!doc.deleted_at && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/doctors/${doc.id}`} method="delete" as="button" className="text-red-600">
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

                    {doctors.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {doctors.from}–{doctors.to} dari {doctors.total} dokter
                            </p>
                            <div className="flex gap-1">
                                {doctors.links.map((link, i) => (
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
