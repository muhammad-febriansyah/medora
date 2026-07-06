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

type Medicine = { id: number; name: string; generic_name: string | null; unit: string; selling_price: number; stock_quantity: number; minimum_stock: number; is_active: boolean; deleted_at: string | null };

function formatRupiah(val: number): string {
    return `Rp ${val.toLocaleString('id-ID')}`;
}

export default function MedicinesIndex() {
    const { medicines, filters } = usePage().props as unknown as {
        medicines: { data: Medicine[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        filters: { search: string };
    };

    return (
        <>
            <Head title="Data Obat" />
            <AppLayout title="Data Obat">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="search"
                            placeholder="Cari nama atau generik..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 2 || value.length === 0) {
                                    window.location.href = value
                                        ? `/medicines?search=${encodeURIComponent(value)}`
                                        : '/medicines';
                                }
                            }}
                        />
                        <Button asChild>
                            <Link href="/medicines/create">
                                <Plus className="size-4" />
                                Tambah Obat
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Obat</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Stok</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medicines.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                Belum ada data obat. <Link href="/medicines/create" className="font-medium text-primary underline">Tambah Obat</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        medicines.data.map((med) => (
                                            <TableRow key={med.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/medicines/${med.id}`}>{med.name}</Link>
                                                    {med.generic_name && <span className="ml-1 text-xs text-muted-foreground">({med.generic_name})</span>}
                                                </TableCell>
                                                <TableCell>{med.unit}</TableCell>
                                                <TableCell className="tabular-nums">{formatRupiah(med.selling_price)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={med.stock_quantity <= med.minimum_stock ? 'destructive' : 'secondary'}>
                                                        {med.stock_quantity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={med.is_active ? 'default' : 'destructive'}>
                                                        {med.is_active ? 'Aktif' : 'Nonaktif'}
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
                                                                <Link href={`/medicines/${med.id}`}><Eye className="size-4" /> Lihat</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/medicines/${med.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                                                            </DropdownMenuItem>
                                                            {!med.deleted_at && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/medicines/${med.id}`} method="delete" as="button" className="text-red-600">
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

                    {medicines.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {medicines.from}–{medicines.to} dari {medicines.total} obat
                            </p>
                            <div className="flex gap-1">
                                {medicines.links.map((link, i) => (
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
