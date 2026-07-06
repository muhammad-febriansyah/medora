import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Duplicate = { id: number; name: string; medical_record_number: string; birth_date: string; nik: string | null };

export default function PatientsCreate() {
    const { nextRm, duplicates, prefillNIK } = usePage().props as unknown as {
        nextRm: string;
        duplicates: Duplicate[];
        prefillNIK: string | null;
    };
    const { data, setData, post, processing, errors } = useForm({
        medical_record_number: nextRm,
        nik: prefillNIK ?? '',
        name: '',
        birth_date: '',
        birth_place: '',
        gender: '',
        address: '',
        phone: '',
        blood_type: '',
        occupation: '',
        guardian_name: '',
        guardian_phone: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/patients');
    }

    return (
        <>
            <Head title="Daftar Pasien Baru" />
            <AppLayout title="Daftar Pasien Baru">
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/patients"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    {duplicates.length > 0 && (
                        <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                            <AlertCircle className="size-4 mt-0.5 shrink-0" />
                            <p>
                                <span className="font-medium">Potensi duplikat:</span> NIK yang sama ditemukan pada{' '}
                                {duplicates.map((d, i) => (
                                    <span key={d.id}>
                                        <Link href={`/patients/${d.id}`} className="font-medium underline">{d.name}</Link>
                                        {' '}({d.medical_record_number}){i < duplicates.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                                . Pastikan pasien belum terdaftar.
                            </p>
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pasien Baru</CardTitle>
                            <p className="text-sm text-muted-foreground">No. RM: {nextRm}</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="nik">NIK <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="nik"
                                        placeholder="Contoh: 3175xxxxxxxxxxxx"
                                        maxLength={16}
                                        inputMode="numeric"
                                        value={data.nik}
                                        onChange={(e) => setData('nik', e.target.value.replace(/\D/g, ''))}
                                    />
                                    {errors.nik && <p className="text-sm text-red-600">{errors.nik}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
                                    <Input id="name" placeholder="Contoh: Budi Santoso" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="birth_place">Tempat Lahir <span className="text-red-500">*</span></Label>
                                        <Input id="birth_place" placeholder="Contoh: Jakarta" value={data.birth_place} onChange={(e) => setData('birth_place', e.target.value)} />
                                        {errors.birth_place && <p className="text-sm text-red-600">{errors.birth_place}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="birth_date">Tanggal Lahir <span className="text-red-500">*</span></Label>
                                        <Input id="birth_date" type="date" value={data.birth_date} onChange={(e) => setData('birth_date', e.target.value)} />
                                        {errors.birth_date && <p className="text-sm text-red-600">{errors.birth_date}</p>}
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="gender">Jenis Kelamin <span className="text-red-500">*</span></Label>
                                        <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                                            <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Laki-laki</SelectItem>
                                                <SelectItem value="female">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="blood_type">Golongan Darah</Label>
                                        <Select value={data.blood_type} onValueChange={(v) => setData('blood_type', v)}>
                                            <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                                <SelectItem value="AB">AB</SelectItem>
                                                <SelectItem value="O">O</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="phone">Telepon <span className="text-red-500">*</span></Label>
                                    <Input id="phone" placeholder="Contoh: 08123456789" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="address">Alamat <span className="text-red-500">*</span></Label>
                                    <Textarea id="address" placeholder="Contoh: Jl. Sudirman No. 12, RT 03 RW 05" rows={3} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                    {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="occupation">Pekerjaan</Label>
                                    <Input id="occupation" placeholder="Contoh: Karyawan Swasta" value={data.occupation} onChange={(e) => setData('occupation', e.target.value)} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="guardian_name">Nama Penanggung Jawab</Label>
                                        <Input id="guardian_name" placeholder="Contoh: Siti Aminah" value={data.guardian_name} onChange={(e) => setData('guardian_name', e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="guardian_phone">Telepon Penanggung Jawab</Label>
                                        <Input id="guardian_phone" placeholder="Contoh: 08129876543" value={data.guardian_phone} onChange={(e) => setData('guardian_phone', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/patients">Batal</Link></Button>
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
