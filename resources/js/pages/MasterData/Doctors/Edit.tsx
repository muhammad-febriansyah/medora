import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Doctor = { id: number; user_id: number; sip_number: string; str_number: string; specialization: string | null; default_department_id: number | null; user: { id: number; name: string; email: string } };
type User = { id: number; name: string; email: string };
type Department = { id: number; name: string };

export default function DoctorsEdit() {
    const { doctor, users, departments } = usePage().props as unknown as { doctor: Doctor; users: User[]; departments: Department[] };
    const { data, setData, put, processing, errors } = useForm({
        user_id: String(doctor.user_id),
        sip_number: doctor.sip_number,
        str_number: doctor.str_number,
        specialization: doctor.specialization ?? '',
        default_department_id: doctor.default_department_id ? String(doctor.default_department_id) : '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/doctors/${doctor.id}`);
    }

    return (
        <>
            <Head title={`Edit ${doctor.user.name}`} />
            <AppLayout title={`Edit Dokter: ${doctor.user.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/doctors"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Edit Data Dokter</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="user_id">User <span className="text-red-500">*</span></Label>
                                    <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                                        <Input id="sip_number" value={data.sip_number} onChange={(e) => setData('sip_number', e.target.value)} />
                                        {errors.sip_number && <p className="text-sm text-red-600">{errors.sip_number}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="str_number">Nomor STR <span className="text-red-500">*</span></Label>
                                        <Input id="str_number" value={data.str_number} onChange={(e) => setData('str_number', e.target.value)} />
                                        {errors.str_number && <p className="text-sm text-red-600">{errors.str_number}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="specialization">Spesialisasi</Label>
                                    <Input id="specialization" value={data.specialization} onChange={(e) => setData('specialization', e.target.value)} />
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
