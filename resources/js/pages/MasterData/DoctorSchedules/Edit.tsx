import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

type Doctor = { id: number; user: { id: number; name: string } };
type Department = { id: number; name: string };
type Schedule = {
    id: number; department_id: number; day_of_week: number;
    start_time: string; end_time: string; quota: number | null; is_active: boolean;
    department: { id: number; name: string };
};

const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function DoctorSchedulesEdit() {
    const { doctor, schedule, departments } = usePage().props as unknown as {
        doctor: Doctor;
        schedule: Schedule;
        departments: Department[];
    };
    const { data, setData, put, processing, errors } = useForm({
        department_id: String(schedule.department_id),
        day_of_week: String(schedule.day_of_week),
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        quota: schedule.quota ? String(schedule.quota) : '',
        is_active: schedule.is_active,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/doctors/${doctor.id}/schedules/${schedule.id}`);
    }

    return (
        <>
            <Head title={`Edit Jadwal ${doctor.user.name}`} />
            <AppLayout title={`Edit Jadwal: ${doctor.user.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/doctors/${doctor.id}/schedules`}>
                                <ArrowLeft className="size-4" /> Kembali
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Edit Jadwal</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="department_id">Poli <span className="text-red-500">*</span></Label>
                                    <Select value={data.department_id} onValueChange={(v) => setData('department_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih poli..." /></SelectTrigger>
                                        <SelectContent>
                                            {departments.map((d) => (
                                                <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.department_id && <p className="text-sm text-red-600">{errors.department_id}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="day_of_week">Hari <span className="text-red-500">*</span></Label>
                                    <Select value={data.day_of_week} onValueChange={(v) => setData('day_of_week', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih hari..." /></SelectTrigger>
                                        <SelectContent>
                                            {dayNames.map((name, i) => (
                                                <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.day_of_week && <p className="text-sm text-red-600">{errors.day_of_week}</p>}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="start_time">Jam Mulai <span className="text-red-500">*</span></Label>
                                        <Input id="start_time" type="time" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} />
                                        {errors.start_time && <p className="text-sm text-red-600">{errors.start_time}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="end_time">Jam Selesai <span className="text-red-500">*</span></Label>
                                        <Input id="end_time" type="time" value={data.end_time} onChange={(e) => setData('end_time', e.target.value)} />
                                        {errors.end_time && <p className="text-sm text-red-600">{errors.end_time}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="quota">Kuota Pasien</Label>
                                    <Input id="quota" type="number" placeholder="Contoh: 40" value={data.quota} onChange={(e) => setData('quota', e.target.value)} min={1} />
                                    {errors.quota && <p className="text-sm text-red-600">{errors.quota}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData('is_active', Boolean(v))} />
                                    <Label htmlFor="is_active">Jadwal aktif</Label>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild>
                                        <Link href={`/doctors/${doctor.id}/schedules`}>Batal</Link>
                                    </Button>
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
