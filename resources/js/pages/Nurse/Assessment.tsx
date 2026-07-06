import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import AllergyBanner from '@/components/shared/allergy-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Allergy = { id: number; allergen: string; severity: 'mild' | 'moderate' | 'severe' };
type Encounter = {
    id: number; uuid: string; encounter_date: string;
    patient: { id: number; name: string; medical_record_number: string; birth_date: string; gender: string; allergies: Allergy[] };
    department: { id: number; name: string } | null;
    queues: { id: number; queue_number: string }[];
};
type PreviousVital = {
    id: number; systolic: number; diastolic: number; pulse: number; temperature: number;
    respiratory_rate: number; spo2: number; weight_kg: number | null; height_cm: number | null;
    encounter: { id: number; encounter_date: string };
    created_at: string;
};
type ExistingVitalSign = {
    id: number; systolic: number; diastolic: number; pulse: number; temperature: number;
    respiratory_rate: number; spo2: number; weight_kg: number | null; height_cm: number | null;
    chief_complaint: string;
};

function bmi(weight: string, height: string): string {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h || h <= 0) return '-';
    return (w / (h * h)).toFixed(1);
}

export default function NurseAssessment() {
    const { encounter, previousVitals, existingVitalSign } = usePage().props as unknown as {
        encounter: Encounter;
        previousVitals: PreviousVital[];
        existingVitalSign: ExistingVitalSign | null;
    };

    const { data, setData, post, processing, errors } = useForm({
        systolic: existingVitalSign?.systolic ? String(existingVitalSign.systolic) : '',
        diastolic: existingVitalSign?.diastolic ? String(existingVitalSign.diastolic) : '',
        pulse: existingVitalSign?.pulse ? String(existingVitalSign.pulse) : '',
        temperature: existingVitalSign?.temperature ? String(existingVitalSign.temperature) : '',
        respiratory_rate: existingVitalSign?.respiratory_rate ? String(existingVitalSign.respiratory_rate) : '',
        spo2: existingVitalSign?.spo2 ? String(existingVitalSign.spo2) : '',
        weight_kg: existingVitalSign?.weight_kg ? String(existingVitalSign.weight_kg) : '',
        height_cm: existingVitalSign?.height_cm ? String(existingVitalSign.height_cm) : '',
        chief_complaint: existingVitalSign?.chief_complaint ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/nurse/assessment/${encounter.uuid}`);
    }

    if (existingVitalSign) {
        return (
            <>
                <Head title="Asesmen Perawat" />
                <AppLayout title="Asesmen Perawat">
                    <div className="max-w-2xl">
                        <Button variant="ghost" size="sm" asChild className="mb-4">
                            <Link href="/nurse/worklist"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        <Card>
                            <CardHeader><CardTitle>Asesmen Sudah Tercatat</CardTitle></CardHeader>
                            <CardContent>
                                <p>Vital signs untuk kunjungan ini sudah dicatat. Lanjutkan ke dokter.</p>
                            </CardContent>
                        </Card>
                    </div>
                </AppLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Asesmen Perawat" />
            <AppLayout title={`Asesmen: ${encounter.patient.name}`}>
                <div className="max-w-2xl">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/nurse/worklist"><ArrowLeft className="size-4" /> Kembali</Link>
                    </Button>

                    <AllergyBanner allergies={encounter.patient.allergies} hasBeenChecked={encounter.patient.allergies.length > 0} />

                    {previousVitals.length > 0 && (
                        <Card className="mt-4">
                            <CardHeader><CardTitle className="text-base">Riwayat Vital Signs</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>TD</TableHead>
                                            <TableHead>Nadi</TableHead>
                                            <TableHead>Suhu</TableHead>
                                            <TableHead>SpO2</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {previousVitals.map((v) => (
                                            <TableRow key={v.id}>
                                                <TableCell className="text-xs">{new Date(v.encounter.encounter_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</TableCell>
                                                <TableCell>{v.systolic}/{v.diastolic}</TableCell>
                                                <TableCell>{v.pulse}</TableCell>
                                                <TableCell>{v.temperature}°C</TableCell>
                                                <TableCell>{v.spo2}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Vital Signs</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {encounter.patient.name} · {encounter.patient.medical_record_number} · {encounter.queues.find(q => q)?.queue_number}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="systolic">TD Sistolik (mmHg) <span className="text-red-500">*</span></Label>
                                        <Input id="systolic" type="number" placeholder="120" value={data.systolic} onChange={(e) => setData('systolic', e.target.value)} />
                                        {errors.systolic && <p className="text-sm text-red-600">{errors.systolic}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="diastolic">TD Diastolik (mmHg) <span className="text-red-500">*</span></Label>
                                        <Input id="diastolic" type="number" placeholder="80" value={data.diastolic} onChange={(e) => setData('diastolic', e.target.value)} />
                                        {errors.diastolic && <p className="text-sm text-red-600">{errors.diastolic}</p>}
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="pulse">Nadi (x/mnt) <span className="text-red-500">*</span></Label>
                                        <Input id="pulse" type="number" placeholder="80" value={data.pulse} onChange={(e) => setData('pulse', e.target.value)} />
                                        {errors.pulse && <p className="text-sm text-red-600">{errors.pulse}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="temperature">Suhu (°C) <span className="text-red-500">*</span></Label>
                                        <Input id="temperature" type="number" step="0.1" placeholder="36.5" value={data.temperature} onChange={(e) => setData('temperature', e.target.value)} />
                                        {errors.temperature && <p className="text-sm text-red-600">{errors.temperature}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="spo2">SpO2 (%) <span className="text-red-500">*</span></Label>
                                        <Input id="spo2" type="number" placeholder="98" value={data.spo2} onChange={(e) => setData('spo2', e.target.value)} />
                                        {errors.spo2 && <p className="text-sm text-red-600">{errors.spo2}</p>}
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="respiratory_rate">RR (x/mnt) <span className="text-red-500">*</span></Label>
                                        <Input id="respiratory_rate" type="number" placeholder="20" value={data.respiratory_rate} onChange={(e) => setData('respiratory_rate', e.target.value)} />
                                        {errors.respiratory_rate && <p className="text-sm text-red-600">{errors.respiratory_rate}</p>}
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="weight_kg">Berat (kg)</Label>
                                        <Input id="weight_kg" type="number" step="0.1" placeholder="65" value={data.weight_kg} onChange={(e) => setData('weight_kg', e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="height_cm">Tinggi (cm)</Label>
                                        <Input id="height_cm" type="number" step="0.1" placeholder="165" value={data.height_cm} onChange={(e) => setData('height_cm', e.target.value)} />
                                    </div>
                                </div>
                                {data.weight_kg && data.height_cm && (
                                    <p className="text-sm text-muted-foreground">BMI: {bmi(data.weight_kg, data.height_cm)}</p>
                                )}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="chief_complaint">Keluhan Utama <span className="text-red-500">*</span></Label>
                                    <Textarea id="chief_complaint" placeholder="Contoh: Demam sejak 3 hari, batuk berdahak" rows={3} value={data.chief_complaint} onChange={(e) => setData('chief_complaint', e.target.value)} />
                                    {errors.chief_complaint && <p className="text-sm text-red-600">{errors.chief_complaint}</p>}
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/nurse/worklist">Batal</Link></Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? (<><Save className="size-4 animate-spin" /> Menyimpan...</>) : (<><Save className="size-4" /> Simpan Asesmen</>)}
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
