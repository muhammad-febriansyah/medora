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

type Service = { id: number; name: string; category: string; price: number; is_active: boolean; deleted_at: string | null };

const categoryLabels: Record<string, string> = {
    consultation: 'Konsultasi',
    procedure: 'Tindakan',
    administration: 'Administrasi',
    lab: 'Lab',
};

function formatRupiah(val: number): string {
    return `Rp ${val.toLocaleString('id-ID')}`;
}

export default function ServicesIndex() {
    const { services, filters } = usePage().props as unknown as {
        services: { data: Service[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        filters: { search: string };
    };

    return (
        <>
            <Head title="Layanan & Tarif" />
            <AppLayout title="Layanan & Tarif">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="search"
                            placeholder="Cari layanan..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 2 || value.length === 0) {
                                    window.location.href = value
                                        ? `/services?search=${encodeURIComponent(value)}`
                                        : '/services';
                                }
                            }}
                        />
                        <Button asChild>
                            <Link href="/services/create">
                                <Plus className="size-4" />
                                Tambah Layanan
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Layanan</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Tarif</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                Belum ada data layanan. <Link href="/services/create" className="font-medium text-primary underline">Tambah Layanan</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        services.data.map((svc) => (
                                            <TableRow key={svc.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/services/${svc.id}`}>{svc.name}</Link>
                                                </TableCell>
                                                <TableCell><Badge variant="secondary">{categoryLabels[svc.category] ?? svc.category}</Badge></TableCell>
                                                <TableCell className="tabular-nums">{formatRupiah(svc.price)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={svc.is_active ? 'default' : 'destructive'}>
                                                        {svc.is_active ? 'Aktif' : 'Nonaktif'}
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
                                                                <Link href={`/services/${svc.id}`}><Eye className="size-4" /> Lihat</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/services/${svc.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                                                            </DropdownMenuItem>
                                                            {!svc.deleted_at && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/services/${svc.id}`} method="delete" as="button" className="text-red-600">
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

                    {services.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {services.from}–{services.to} dari {services.total} layanan
                            </p>
                            <div className="flex gap-1">
                                {services.links.map((link, i) => (
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
