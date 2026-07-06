import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Clinic = {
    id: number; name: string; address: string | null; phone: string | null;
    license_number: string | null; opening_hours: string | null;
    rm_prefix: string; rm_digits: number; default_registration_fee: number;
};

export default function ClinicSettings() {
    const { clinic } = usePage().props as unknown as { clinic: Clinic };
    const { data, setData, put, processing } = useForm({
        name: clinic.name,
        address: clinic.address ?? '',
        phone: clinic.phone ?? '',
        license_number: clinic.license_number ?? '',
        opening_hours: clinic.opening_hours ?? '',
        rm_prefix: clinic.rm_prefix,
        rm_digits: String(clinic.rm_digits),
        default_registration_fee: String(clinic.default_registration_fee),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put('/settings/clinic');
    }

    return (
        <>
            <Head title="Pengaturan Klinik" />
            <AppLayout title="Pengaturan Klinik">
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader><CardTitle>Profil Klinik</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Nama Klinik <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Nama klinik" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Alamat</Label>
                                    <Textarea rows={2} placeholder="Alamat lengkap klinik" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label>Telepon</Label>
                                        <Input placeholder="Nomor telepon" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Nomor Izin</Label>
                                        <Input placeholder="No. izin operasional" value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Jam Operasional</Label>
                                    <Input placeholder="Contoh: Senin-Sabtu, 08.00-21.00 WIB" value={data.opening_hours} onChange={(e) => setData('opening_hours', e.target.value)} />
                                </div>
                                <hr />
                                <p className="text-sm font-medium text-muted-foreground">Pengaturan Nomor RM</p>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label>Prefix RM</Label>
                                        <Input value={data.rm_prefix} onChange={(e) => setData('rm_prefix', e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Jumlah Digit</Label>
                                        <Input type="number" min={3} max={10} value={data.rm_digits} onChange={(e) => setData('rm_digits', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Biaya Pendaftaran Default (Rp)</Label>
                                    <Input type="number" value={data.default_registration_fee} onChange={(e) => setData('default_registration_fee', e.target.value)} />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={processing}>
                                        <Save className="size-4" /> Simpan Pengaturan
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
