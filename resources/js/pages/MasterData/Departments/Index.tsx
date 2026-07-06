import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type Department = { id: number; name: string; queue_code: string; is_active: boolean; deleted_at: string | null };

export default function DepartmentsIndex() {
    const { departments, filters } = usePage().props as unknown as {
        departments: { data: Department[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        filters: { search: string };
    };

    return (
        <>
            <Head title="Data Poli" />
            <AppLayout title="Data Poli">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="search"
                            placeholder="Cari nama poli..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 2 || value.length === 0) {
                                    window.location.href = value
                                        ? `/departments?search=${encodeURIComponent(value)}`
                                        : '/departments';
                                }
                            }}
                        />
                        <Button asChild>
                            <Link href="/departments/create">
                                <Plus className="size-4" />
                                Tambah Poli
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Poli</TableHead>
                                        <TableHead>Kode Antrian</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {departments.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                Belum ada data poli. <Link href="/departments/create" className="font-medium text-primary underline">Tambah Poli</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        departments.data.map((dept) => (
                                            <TableRow key={dept.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/departments/${dept.id}`}>{dept.name}</Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{dept.queue_code}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={dept.is_active ? 'default' : 'destructive'}>
                                                        {dept.is_active ? 'Aktif' : 'Nonaktif'}
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
                                                                <Link href={`/departments/${dept.id}`}>
                                                                    <Eye className="size-4" /> Lihat
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/departments/${dept.id}/edit`}>
                                                                    <Pencil className="size-4" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {!dept.deleted_at && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={`/departments/${dept.id}`}
                                                                        method="delete"
                                                                        as="button"
                                                                        className="text-red-600"
                                                                    >
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

                    {departments.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {departments.from}–{departments.to} dari {departments.total} poli
                            </p>
                            <div className="flex gap-1">
                                {departments.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                    >
                                        {link.url ? (
                                            <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
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
