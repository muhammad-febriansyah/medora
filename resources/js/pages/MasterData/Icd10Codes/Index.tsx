import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

type Icd10Code = { id: number; code: string; description_id: string; description_en: string };

export default function Icd10CodesIndex() {
    const { codes, filters } = usePage().props as unknown as {
        codes: { data: Icd10Code[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        filters: { search: string };
    };

    return (
        <>
            <Head title="Kode ICD-10" />
            <AppLayout title="Kode ICD-10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="search"
                            placeholder="Cari kode atau deskripsi..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 2 || value.length === 0) {
                                    window.location.href = value
                                        ? `/icd10-codes?search=${encodeURIComponent(value)}`
                                        : '/icd10-codes';
                                }
                            }}
                        />
                        <Button asChild>
                            <Link href="/icd10-codes/create">
                                <Plus className="size-4" />
                                Tambah Kode
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Deskripsi (ID)</TableHead>
                                        <TableHead>Deskripsi (EN)</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {codes.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                Belum ada data kode ICD-10. <Link href="/icd10-codes/create" className="font-medium text-primary underline">Tambah Kode</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        codes.data.map((c) => (
                                            <TableRow key={c.id}>
                                                <TableCell className="font-medium font-mono">
                                                    <Link href={`/icd10-codes/${c.id}`}>{c.code}</Link>
                                                </TableCell>
                                                <TableCell>{c.description_id}</TableCell>
                                                <TableCell className="text-muted-foreground">{c.description_en}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="size-8">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/icd10-codes/${c.id}`}><Eye className="size-4" /> Lihat</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/icd10-codes/${c.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/icd10-codes/${c.id}`} method="delete" as="button" className="text-red-600">
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

                    {codes.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {codes.from}–{codes.to} dari {codes.total} kode
                            </p>
                            <div className="flex gap-1">
                                {codes.links.map((link, i) => (
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
