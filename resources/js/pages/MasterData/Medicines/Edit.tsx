import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type Medicine = { id: number; name: string; generic_name: string | null; unit: string; dosage_form: string | null; selling_price: number; minimum_stock: number; is_active: boolean };

export default function MedicinesEdit() {
    const { medicine } = usePage().props as unknown as { medicine: Medicine };
    const { data, setData, put, processing, errors } = useForm({
        name: medicine.name,
        generic_name: medicine.generic_name ?? '',
        unit: medicine.unit,
        dosage_form: medicine.dosage_form ?? '',
        selling_price: String(medicine.selling_price),
        minimum_stock: String(medicine.minimum_stock),
        is_active: medicine.is_active,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/medicines/${medicine.id}`);
    }

    return (
        <>
            <Head title={`Edit ${medicine.name}`} />
            <AppLayout title={`Edit Obat: ${medicine.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/medicines"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Edit Data Obat</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Nama Obat <span className="text-red-500">*</span></Label>
                                    <Input id="name" placeholder="Contoh: Paracetamol 500mg" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="generic_name">Nama Generik</Label>
                                    <Input id="generic_name" placeholder="Contoh: Paracetamol" value={data.generic_name} onChange={(e) => setData('generic_name', e.target.value)} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="unit">Satuan <span className="text-red-500">*</span></Label>
                                        <Input id="unit" placeholder="Contoh: tablet" value={data.unit} onChange={(e) => setData('unit', e.target.value)} />
                                        {errors.unit && <p className="text-sm text-red-600">{errors.unit}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="dosage_form">Bentuk Sediaan</Label>
                                        <Input id="dosage_form" placeholder="Contoh: tablet" value={data.dosage_form} onChange={(e) => setData('dosage_form', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="selling_price">Harga Jual (Rp) <span className="text-red-500">*</span></Label>
                                        <Input id="selling_price" placeholder="Contoh: 500" inputMode="numeric" value={data.selling_price} onChange={(e) => setData('selling_price', e.target.value)} />
                                        {errors.selling_price && <p className="text-sm text-red-600">{errors.selling_price}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="minimum_stock">Stok Minimum <span className="text-red-500">*</span></Label>
                                        <Input id="minimum_stock" placeholder="Contoh: 10" inputMode="numeric" value={data.minimum_stock} onChange={(e) => setData('minimum_stock', e.target.value)} />
                                        {errors.minimum_stock && <p className="text-sm text-red-600">{errors.minimum_stock}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                                    <Label htmlFor="is_active">Obat aktif</Label>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/medicines">Batal</Link></Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? (<><Save className="size-4 animate-spin" /> Menyimpan...</>) : (<><Save className="size-4" /> Simpan</>)}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
