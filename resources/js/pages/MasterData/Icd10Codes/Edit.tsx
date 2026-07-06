import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Icd10Code = { id: number; code: string; description_en: string; description_id: string | null };

export default function Icd10CodesEdit() {
    const { code } = usePage().props as unknown as { code: Icd10Code };
    const { data, setData, put, processing, errors } = useForm({
        code: code.code,
        description_en: code.description_en,
        description_id: code.description_id ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/icd10-codes/${code.id}`);
    }

    return (
        <>
            <Head title={`Edit ${code.code}`} />
            <AppLayout title={`Edit Kode: ${code.code}`}>
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/icd10-codes"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Edit Data Kode</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="code">Kode ICD-10 <span className="text-red-500">*</span></Label>
                                    <Input id="code" placeholder="Contoh: J00" maxLength={10} value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} />
                                    {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="description_id">Deskripsi (Indonesia)</Label>
                                    <Input id="description_id" placeholder="Contoh: Nasofaringitis akut" value={data.description_id} onChange={(e) => setData('description_id', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="description_en">Deskripsi (English) <span className="text-red-500">*</span></Label>
                                    <Textarea id="description_en" placeholder="Contoh: Acute nasopharyngitis" rows={3} value={data.description_en} onChange={(e) => setData('description_en', e.target.value)} />
                                    {errors.description_en && <p className="text-sm text-red-600">{errors.description_en}</p>}
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/icd10-codes">Batal</Link></Button>
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
