import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ServicesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: 'consultation',
        icd9cm_code: '',
        price: '',
        is_active: true,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/services');
    }

    return (
        <>
            <Head title="Tambah Layanan" />
            <AppLayout title="Tambah Layanan">
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/services"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Data Layanan Baru</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Nama Layanan <span className="text-red-500">*</span></Label>
                                    <Input id="name" placeholder="Contoh: Konsultasi Poli Umum" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="category">Kategori <span className="text-red-500">*</span></Label>
                                    <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="consultation">Konsultasi</SelectItem>
                                            <SelectItem value="procedure">Tindakan</SelectItem>
                                            <SelectItem value="administration">Administrasi</SelectItem>
                                            <SelectItem value="lab">Lab</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="icd9cm_code">Kode ICD-9-CM</Label>
                                    <Input id="icd9cm_code" placeholder="Contoh: 99213" value={data.icd9cm_code} onChange={(e) => setData('icd9cm_code', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="price">Tarif (Rp) <span className="text-red-500">*</span></Label>
                                    <Input id="price" placeholder="Contoh: 75000" inputMode="numeric" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                                    {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                                    <Label htmlFor="is_active">Layanan aktif</Label>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/services">Batal</Link></Button>
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
