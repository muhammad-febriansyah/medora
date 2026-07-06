import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Banknote, Printer } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type InvoiceItem = { id: number; item_name_snapshot: string; category: string; unit_price_snapshot: number; quantity: number; line_total: number };
type Encounter = {
    id: number; uuid: string;
    patient: { id: number; name: string; medical_record_number: string };
    department: { id: number; name: string } | null;
    invoice: { id: number; invoice_number: string; total: number; items: InvoiceItem[] } | null;
};

function formatRupiah(v: number): string {
    return `Rp ${v.toLocaleString('id-ID')}`;
}

export default function CashierProcess() {
    const { encounter } = usePage().props as unknown as { encounter: Encounter };
    const invoice = encounter.invoice;
    const { data, setData, post, processing, errors } = useForm({
        method: 'cash',
        amount: String(invoice?.total ?? 0),
        amount_tendered: '',
    });

    const totalInt = parseInt(data.amount) || 0;
    const tendered = parseInt(data.amount_tendered) || 0;
    const change = data.method === 'cash' ? tendered - totalInt : 0;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/cashier/pay/${encounter.uuid}`);
    }

    return (
        <>
            <Head title="Pembayaran" />
            <AppLayout title="Proses Pembayaran">
                <div className="max-w-3xl">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/cashier/worklist"><ArrowLeft className="size-4" /> Kembali</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="mb-4 ml-auto">
                        <Link href={`/print/receipt/${encounter.uuid}`} target="_blank">
                            <Printer className="size-4" /> Cetak Kuitansi
                        </Link>
                    </Button>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{encounter.patient.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{encounter.patient.medical_record_number} · {encounter.department?.name}</p>
                            </CardHeader>
                            <CardContent>
                                {invoice?.items?.length ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead className="text-right">Harga</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invoice.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <span className="text-sm">{item.item_name_snapshot}</span>
                                                        <Badge variant="secondary" className="ml-2">{item.category}</Badge>
                                                        {item.quantity > 1 && <span className="text-xs text-muted-foreground ml-1">x{item.quantity}</span>}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">{formatRupiah(item.line_total)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Belum ada item tagihan.</p>
                                )}
                                <Separator className="my-4" />
                                <div className="text-right">
                                    <p className="text-3xl font-bold tabular-nums">{invoice ? formatRupiah(invoice.total) : 'Rp 0'}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Pembayaran</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Metode Bayar <span className="text-red-500">*</span></Label>
                                        <Select value={data.method} onValueChange={(v) => setData('method', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Tunai</SelectItem>
                                                <SelectItem value="transfer">Transfer</SelectItem>
                                                <SelectItem value="qris_static">QRIS</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="amount">Jumlah <span className="text-red-500">*</span></Label>
                                        <Input id="amount" type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} />
                                    </div>
                                    {data.method === 'cash' && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="amount_tendered">Tunai Diterima <span className="text-red-500">*</span></Label>
                                            <Input id="amount_tendered" type="number" value={data.amount_tendered} onChange={(e) => setData('amount_tendered', e.target.value)} />
                                            {tendered > 0 && (
                                                <p className={change >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                    Kembalian: {formatRupiah(Math.max(0, change))}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={processing}>
                                        <Banknote className="size-4" /> Proses Pembayaran
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
