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

type LabTest = { id: number; name: string; price: number; is_active: boolean; deleted_at: string | null };

function formatRupiah(val: number): string {
    return `Rp ${val.toLocaleString('id-ID')}`;
}

export default function LabTestsIndex() {
    const { labTests, filters } = usePage().props as unknown as {
        labTests: { data: LabTest[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        filters: { search: string };
    };

    return (
        <>
            <Head title="Pemeriksaan Lab" />
            <AppLayout title="Pemeriksaan Lab">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="search"
                            placeholder="Cari pemeriksaan..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 2 || value.length === 0) {
                                    window.location.href = value
                                        ? `/lab-tests?search=${encodeURIComponent(value)}`
                                        : '/lab-tests';
                                }
                            }}
                        />
                        <Button asChild>
                            <Link href="/lab-tests/create">
                                <Plus className="size-4" />
                                Tambah Pemeriksaan
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pemeriksaan</TableHead>
                                        <TableHead>Tarif</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {labTests.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                Belum ada data pemeriksaan lab. <Link href="/lab-tests/create" className="font-medium text-primary underline">Tambah Pemeriksaan</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        labTests.data.map((lt) => (
                                            <TableRow key={lt.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/lab-tests/${lt.id}`}>{lt.name}</Link>
                                                </TableCell>
                                                <TableCell className="tabular-nums">{formatRupiah(lt.price)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={lt.is_active ? 'default' : 'destructive'}>
                                                        {lt.is_active ? 'Aktif' : 'Nonaktif'}
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
                                                                <Link href={`/lab-tests/${lt.id}`}><Eye className="size-4" /> Lihat</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/lab-tests/${lt.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                                                            </DropdownMenuItem>
                                                            {!lt.deleted_at && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/lab-tests/${lt.id}`} method="delete" as="button" className="text-red-600">
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

                    {labTests.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {labTests.from}–{labTests.to} dari {labTests.total} pemeriksaan
                            </p>
                            <div className="flex gap-1">
                                {labTests.links.map((link, i) => (
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
