import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type Department = { id: number; name: string; queue_code: string; is_active: boolean };

export default function DepartmentsEdit() {
    const { department } = usePage().props as unknown as { department: Department };
    const { data, setData, put, processing, errors } = useForm({
        name: department.name,
        queue_code: department.queue_code,
        is_active: department.is_active,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/departments/${department.id}`);
    }

    return (
        <>
            <Head title={`Edit ${department.name}`} />
            <AppLayout title={`Edit Poli: ${department.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/departments"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Edit Data Poli</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Nama Poli <span className="text-red-500">*</span></Label>
                                    <Input id="name" placeholder="Contoh: Poli Umum" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="queue_code">Kode Antrian <span className="text-red-500">*</span></Label>
                                    <Input id="queue_code" placeholder="Contoh: U" maxLength={10} value={data.queue_code} onChange={(e) => setData('queue_code', e.target.value.toUpperCase())} />
                                    {errors.queue_code && <p className="text-sm text-red-600">{errors.queue_code}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                                    <Label htmlFor="is_active">Poli aktif</Label>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/departments">Batal</Link></Button>
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
