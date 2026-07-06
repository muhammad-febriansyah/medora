import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, Save, Search } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Department = { id: number; name: string };
type Doctor = { id: number; user: { id: number; name: string } };
type Patient = { id: number; name: string; medical_record_number: string; nik: string | null; birth_date: string; gender: string };

export default function EncountersCreate() {
    const { departments, doctors, today } = usePage().props as unknown as {
        departments: Department[];
        doctors: Doctor[];
        today: string;
    };
    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        department_id: '',
        doctor_id: '',
        encounter_date: today,
        visit_type: 'new',
        payer_type: 'self',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Patient[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

    const searchPatients = useCallback((q: string) => {
        setSearchQuery(q);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (q.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        searchTimeout.current = setTimeout(async () => {
            const res = await fetch(`/encounters/search-patient?q=${encodeURIComponent(q)}`);
            const json = await res.json();
            setSearchResults(json);
            setSearching(false);
        }, 300);
    }, []);

    function selectPatient(p: Patient) {
        setSelectedPatient(p);
        setData('patient_id', String(p.id));
        setSearchQuery(`${p.name} (${p.medical_record_number})`);
        setSearchResults([]);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/encounters');
    }

    return (
        <>
            <Head title="Registrasi Kunjungan" />
            <AppLayout title="Registrasi Kunjungan Baru">
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/encounters"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Registrasi Kunjungan</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Pasien <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Cari nomor RM, NIK, atau nama pasien..."
                                            value={searchQuery}
                                            onChange={(e) => searchPatients(e.target.value)}
                                            onFocus={() => searchPatients(searchQuery)}
                                        />
                                        {searching && <p className="text-xs text-muted-foreground mt-1">Mencari...</p>}
                                        {searchResults.length > 0 && (
                                            <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg max-h-48 overflow-auto">
                                                {searchResults.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                                                        onClick={() => selectPatient(p)}
                                                    >
                                                        <span className="font-mono font-medium">{p.medical_record_number}</span>
                                                        <span>{p.name}</span>
                                                        {p.nik && <span className="ml-auto text-xs text-muted-foreground">{p.nik}</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tidak ditemukan.{' '}
                                                <Link href="/patients/create" className="text-primary underline">Daftar pasien baru?</Link>
                                            </p>
                                        )}
                                    </div>
                                    {selectedPatient && (
                                        <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm">
                                            <Check className="size-4 text-green-600" />
                                            <span className="font-mono font-medium">{selectedPatient.medical_record_number}</span>
                                            <span>{selectedPatient.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {selectedPatient.gender === 'male' ? 'L' : 'P'}, {new Date(selectedPatient.birth_date).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    )}
                                    {errors.patient_id && <p className="text-sm text-red-600">{errors.patient_id}</p>}
                                </div>

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
                                    <Label htmlFor="doctor_id">Dokter <span className="text-red-500">*</span></Label>
                                    <Select value={data.doctor_id} onValueChange={(v) => setData('doctor_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih dokter..." /></SelectTrigger>
                                        <SelectContent>
                                            {doctors.map((d) => (
                                                <SelectItem key={d.id} value={String(d.id)}>{d.user.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.doctor_id && <p className="text-sm text-red-600">{errors.doctor_id}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="encounter_date">Tanggal Kunjungan <span className="text-red-500">*</span></Label>
                                    <Input id="encounter_date" type="date" value={data.encounter_date} onChange={(e) => setData('encounter_date', e.target.value)} />
                                    {errors.encounter_date && <p className="text-sm text-red-600">{errors.encounter_date}</p>}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="visit_type">Jenis Kunjungan <span className="text-red-500">*</span></Label>
                                        <Select value={data.visit_type} onValueChange={(v) => setData('visit_type', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">Baru</SelectItem>
                                                <SelectItem value="follow_up">Kontrol</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.visit_type && <p className="text-sm text-red-600">{errors.visit_type}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="payer_type">Metode Bayar <span className="text-red-500">*</span></Label>
                                        <Select value={data.payer_type} onValueChange={(v) => setData('payer_type', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="self">Umum</SelectItem>
                                                <SelectItem value="insurance_manual">Asuransi (Manual)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.payer_type && <p className="text-sm text-red-600">{errors.payer_type}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild><Link href="/encounters">Batal</Link></Button>
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
