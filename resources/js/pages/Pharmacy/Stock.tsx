import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Plus, AlertTriangle, ArrowDownUp } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Medicine = { id: number; name: string; unit: string; stock_quantity: number; minimum_stock: number; selling_price: number };

function formatRupiah(v: number): string { return `Rp ${v.toLocaleString('id-ID')}`; }

export default function PharmacyStock() {
    const { medicines, filters, critical } = usePage().props as unknown as {
        medicines: { data: Medicine[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        filters: { search: string };
        critical: number;
    };

    const stockInForm = useForm({ medicine_id: '', quantity: '', unit_cost: '', expired_date: '' });
    const adjustForm = useForm({ medicine_id: '', quantity: '', reason: '' });
    const [selectedName, setSelectedName] = useState('');

    function openStockIn(m: Medicine) {
        setSelectedName(m.name);
        stockInForm.setData('medicine_id', String(m.id));
    }

    function openAdjust(m: Medicine) {
        setSelectedName(m.name);
        adjustForm.setData('medicine_id', String(m.id));
    }

    function submitStockIn() {
        stockInForm.post('/stock/in', { onSuccess: () => stockInForm.reset() });
    }

    function submitAdjust() {
        adjustForm.post('/stock/adjust', { onSuccess: () => adjustForm.reset() });
    }

    return (
        <>
            <Head title="Manajemen Stok" />
            <AppLayout title="Manajemen Stok Obat">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Input type="search" placeholder="Cari obat..." defaultValue={filters.search} className="max-w-xs"
                                onChange={(e) => {
                                    const v = e.target.value;
                                    window.location.href = v ? `/stock?search=${encodeURIComponent(v)}` : '/stock';
                                }}
                            />
                            {critical > 0 && (
                                <Badge variant="destructive"><AlertTriangle className="size-3" /> {critical} obat stok kritis</Badge>
                            )}
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Obat</TableHead>
                                        <TableHead className="text-center">Stok</TableHead>
                                        <TableHead className="text-center">Min</TableHead>
                                        <TableHead className="text-right">Harga Jual</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medicines.data.map((m) => (
                                        <TableRow key={m.id}>
                                            <TableCell className="font-medium">
                                                {m.name}
                                                <span className="ml-1 text-xs text-muted-foreground">({m.unit})</span>
                                            </TableCell>
                                            <TableCell className="text-center tabular-nums">
                                                <Badge variant={m.stock_quantity <= m.minimum_stock ? 'destructive' : 'outline'}>
                                                    {m.stock_quantity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">{m.minimum_stock}</TableCell>
                                            <TableCell className="text-right tabular-nums">{formatRupiah(m.selling_price)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="outline" onClick={() => openStockIn(m)}>
                                                                <Plus className="size-3" /> Stok Masuk
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Tambah Stok: {selectedName}</AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col gap-2">
                                                                    <Label>Jumlah <span className="text-red-500">*</span></Label>
                                                                    <Input type="number" value={stockInForm.data.quantity} onChange={(e) => stockInForm.setData('quantity', e.target.value)} />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <Label>Harga Beli (opsional)</Label>
                                                                    <Input type="number" value={stockInForm.data.unit_cost} onChange={(e) => stockInForm.setData('unit_cost', e.target.value)} />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <Label>Expired (opsional)</Label>
                                                                    <Input type="date" value={stockInForm.data.expired_date} onChange={(e) => stockInForm.setData('expired_date', e.target.value)} />
                                                                </div>
                                                            </div>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction disabled={!stockInForm.data.quantity} onClick={submitStockIn}>Simpan</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="ghost" onClick={() => openAdjust(m)}>
                                                                <ArrowDownUp className="size-3" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Stock Opname: {selectedName}</AlertDialogTitle>
                                                                <AlertDialogDescription>Stok saat ini: {m.stock_quantity}. Masukkan selisih (negatif = kurang, positif = lebih).</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col gap-2">
                                                                    <Label>Selisih <span className="text-red-500">*</span></Label>
                                                                    <Input type="number" value={adjustForm.data.quantity} onChange={(e) => adjustForm.setData('quantity', e.target.value)} />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <Label>Alasan <span className="text-red-500">*</span></Label>
                                                                    <Textarea rows={2} value={adjustForm.data.reason} onChange={(e) => adjustForm.setData('reason', e.target.value)} placeholder="Alasan penyesuaian..." />
                                                                </div>
                                                            </div>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction disabled={!adjustForm.data.quantity || !adjustForm.data.reason} onClick={submitAdjust}>Simpan</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
