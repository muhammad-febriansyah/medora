import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type User = { id: number; name: string; email: string };
type Department = { id: number; name: string };

export default function DoctorsCreate() {
    const { users, departments } = usePage().props as unknown as { users: User[]; departments: Department[] };
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        sip_number: '',
        str_number: '',
        specialization: '',
        default_department_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/doctors');
    }

    return (
        <>
            <Head title="Tambah Dokter" />
            <AppLayout title="Tambah Dokter">
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/doctors"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Data Dokter Baru</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="user_id">User <span className="text-red-500">*</span></Label>
                                    <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih user..." /></SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)}>{u.name} ({u.email})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && <p className="text-sm text-red-600">{errors.user_id}</p>}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="sip_number">Nomor SIP <span className="text-red-500">*</span></Label>
                                        <Input id="sip_number" placeholder="Contoh: SIP.123/456/2024" value={data.sip_number} onChange={(e) => setData('sip_number', e.target.value)} />
                                        {errors.sip_number && <p className="text-sm text-red-600">{errors.sip_number}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="str_number">Nomor STR <span className="text-red-500">*</span></Label>
                                        <Input id="str_number" placeholder="Contoh: STR.123/456/2024" value={data.str_number} onChange={(e) => setData('str_number', e.target.value)} />
                                        {errors.str_number && <p className="text-sm text-red-600">{errors.str_number}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="specialization">Spesialisasi</Label>
                                    <Input id="specialization" placeholder="Contoh: Dokter Umum" value={data.specialization} onChange={(e) => setData('specialization', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="default_department_id">Poli Default</Label>
                                    <Select value={data.default_department_id} onValueChange={(v) => setData('default_department_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih poli..." /></SelectTrigger>
                                        <SelectContent>
                                            {departments.map((d) => (
                                                <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/doctors">Batal</Link></Button>
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
