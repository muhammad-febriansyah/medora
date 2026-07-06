import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

type ParamRow = { parameter_name: string; unit: string; normal_range_male: string; normal_range_female: string };

export default function LabTestsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        is_active: true,
        parameters: [] as ParamRow[],
    });

    function addParam() {
        setData('parameters', [...data.parameters, { parameter_name: '', unit: '', normal_range_male: '', normal_range_female: '' }]);
    }

    function removeParam(i: number) {
        setData('parameters', data.parameters.filter((_, idx) => idx !== i));
    }

    function updateParam(i: number, field: keyof ParamRow, value: string) {
        const params = [...data.parameters];
        params[i] = { ...params[i], [field]: value };
        setData('parameters', params);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/lab-tests');
    }

    return (
        <>
            <Head title="Tambah Pemeriksaan Lab" />
            <AppLayout title="Tambah Pemeriksaan Lab">
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/lab-tests"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Data Pemeriksaan Baru</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Nama Pemeriksaan <span className="text-red-500">*</span></Label>
                                    <Input id="name" placeholder="Contoh: Darah Lengkap" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="price">Tarif (Rp) <span className="text-red-500">*</span></Label>
                                    <Input id="price" placeholder="Contoh: 75000" inputMode="numeric" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                                    {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked as boolean)} />
                                    <Label htmlFor="is_active">Pemeriksaan aktif</Label>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <Label>Parameter Pemeriksaan</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addParam}>
                                        <Plus className="size-4" /> Tambah Parameter
                                    </Button>
                                </div>

                                {data.parameters.map((param, i) => (
                                    <div key={i} className="rounded border p-3 flex flex-col gap-2">
                                        <div className="flex justify-end">
                                            <Button type="button" variant="ghost" size="icon" className="size-6 text-red-500" onClick={() => removeParam(i)}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor={`param-${i}-name`}>Nama Parameter <span className="text-red-500">*</span></Label>
                                            <Input id={`param-${i}-name`} placeholder="Contoh: Hemoglobin" value={param.parameter_name} onChange={(e) => updateParam(i, 'parameter_name', e.target.value)} />
                                            {errors[`parameters.${i}.parameter_name`] && (
                                                <p className="text-sm text-red-600">{errors[`parameters.${i}.parameter_name`]}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2 md:grid-cols-2">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor={`param-${i}-unit`}>Satuan</Label>
                                                <Input id={`param-${i}-unit`} placeholder="Contoh: g/dL" value={param.unit} onChange={(e) => updateParam(i, 'unit', e.target.value)} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                &nbsp;
                                            </div>
                                        </div>
                                        <div className="grid gap-2 md:grid-cols-2">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor={`param-${i}-male`}>Rentang Normal (Laki-laki)</Label>
                                                <Input id={`param-${i}-male`} placeholder="Contoh: 13-17" value={param.normal_range_male} onChange={(e) => updateParam(i, 'normal_range_male', e.target.value)} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor={`param-${i}-female`}>Rentang Normal (Perempuan)</Label>
                                                <Input id={`param-${i}-female`} placeholder="Contoh: 12-15" value={param.normal_range_female} onChange={(e) => updateParam(i, 'normal_range_female', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/lab-tests">Batal</Link></Button>
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
