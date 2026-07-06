import { Head, Link, useForm, usePage, usePoll } from '@inertiajs/react';
import { ArrowLeft, LockKeyhole, Plus, Save, Trash2, Stethoscope, Pill, FlaskConical } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/shared/app-layout';
import AllergyBanner from '@/components/shared/allergy-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Allergy = { id: number; allergen: string; severity: string };
type Icd10Code = { id: number; code: string; description_en: string; description_id: string | null };
type Diagnosis = { id: number; type: string; notes: string | null; icd10_code: Icd10Code };
type VitalSign = { id: number; systolic: number; diastolic: number; temperature: number; pulse: number; spo2: number; respiratory_rate: number; weight_kg: number | null; height_cm: number | null; chief_complaint: string };
type ClinicalNote = { id: number; subjective: string; objective: string; assessment: string; plan: string; status: string; finalized_at: string | null; finalized_by: number | null; amendments: { id: number; content: string; created_by: number; created_at: string }[] } | null;
type Medicine = { id: number; name: string; unit: string; stock_quantity: number; selling_price: number };
type LabTest = { id: number; name: string; price: number };
type PrescriptionItem = {
    medicine_id: string; medicine_name: string; unit: string;
    quantity: string; dosage: string; instruction: string; is_racikan: boolean;
};
type Encounter = {
    id: number; uuid: string; status: string;
    patient: { id: number; name: string; medical_record_number: string; birth_date: string; gender: string; allergies: Allergy[] };
    department: { id: number; name: string } | null;
    doctor: { user: { id: number; name: string } } | null;
    vital_signs: VitalSign[];
    clinical_note: ClinicalNote;
    diagnoses: Diagnosis[];
    procedures: { id: number; service_name_snapshot: string; price_snapshot: number; quantity: number }[];
    prescriptions: { id: number; status: string; items: { id: number; medicine_name_snapshot: string; quantity: number; dosage: string }[] }[];
    lab_orders: { id: number; status: string; items: { id: number; test_name_snapshot: string }[] }[];
};

function age(birthDate: string): number {
    const bd = new Date(birthDate);
    const today = new Date();
    let a = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
    return a;
}

export default function DoctorEmr() {
    const { encounter, labTests } = usePage().props as unknown as {
        encounter: Encounter;
        labTests: LabTest[];
    };
    const note = encounter.clinical_note;
    const isFinal = note?.status === 'final';
    const vs = encounter.vital_signs[0];

    const soapForm = useForm({
        subjective: note?.subjective ?? '',
        objective: note?.objective ?? '',
        assessment: note?.assessment ?? '',
        plan: note?.plan ?? '',
    });

    const [diagSearch, setDiagSearch] = useState('');
    const [diagResults, setDiagResults] = useState<Icd10Code[]>([]);
    const [diagType, setDiagType] = useState('primary');
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

    const addendumForm = useForm({ content: '' });

    const diagnosisForm = useForm({
        icd10_code_id: '',
        type: 'secondary',
        notes: '',
    });

    const [medSearch, setMedSearch] = useState('');
    const [medResults, setMedResults] = useState<Medicine[]>([]);
    const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
    const [pendingItems, setPendingItems] = useState<PrescriptionItem[]>([]);
    const [rxQty, setRxQty] = useState('1');
    const [rxDosage, setRxDosage] = useState('');
    const [rxInstruction, setRxInstruction] = useState('');
    const medTimeout = useRef<ReturnType<typeof setTimeout>>();

    const rxForm = useForm({
        encounter_id: String(encounter.id),
        items: [] as any[],
    });

    const labForm = useForm({
        encounter_id: String(encounter.id),
        lab_test_id: '',
    });

    useEffect(() => {
        if (diagSearch.length >= 2) {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            searchTimeout.current = setTimeout(async () => {
                const res = await fetch(`/icd10-codes/search?q=${encodeURIComponent(diagSearch)}`);
                setDiagResults(await res.json());
            }, 300);
        } else { setDiagResults([]); }
    }, [diagSearch]);

    useEffect(() => {
        if (medSearch.length < 2) { setMedResults([]); return; }
        if (medTimeout.current) clearTimeout(medTimeout.current);
        medTimeout.current = setTimeout(async () => {
            const res = await fetch(`/medicines/search?q=${encodeURIComponent(medSearch)}`);
            setMedResults(await res.json());
        }, 300);
    }, [medSearch]);

    function addRxItem() {
        if (!selectedMed || !rxDosage) return;
        setPendingItems([...pendingItems, {
            medicine_id: String(selectedMed.id), medicine_name: selectedMed.name, unit: selectedMed.unit,
            quantity: rxQty || '1', dosage: rxDosage, instruction: rxInstruction, is_racikan: false,
        }]);
        setSelectedMed(null);
        setMedSearch('');
        setMedResults([]);
        setRxQty('1');
        setRxDosage('');
        setRxInstruction('');
    }

    function removeRxItem(idx: number) {
        setPendingItems(pendingItems.filter((_, i) => i !== idx));
    }

    function submitRx() {
        if (pendingItems.length === 0) return;
        rxForm.setData('items', pendingItems.map((p) => ({
            medicine_id: parseInt(p.medicine_id),
            quantity: parseInt(p.quantity),
            dosage: p.dosage,
            instruction: p.instruction,
            is_racikan: p.is_racikan,
        })));
        rxForm.post('/prescriptions', {
            onSuccess: () => setPendingItems([]),
        });
    }

    function submitLab() {
        if (!labForm.data.lab_test_id) return;
        labForm.post('/lab-orders', {
            onSuccess: () => labForm.reset(),
        });
    }

    function saveDraft(e: React.FormEvent) {
        e.preventDefault();
        soapForm.put(`/doctor/emr/${encounter.uuid}/soap`, {
            onSuccess: () => {},
        });
    }

    function addDiagnosis() {
        diagnosisForm.post(`/diagnoses/${encounter.uuid}`, {
            onSuccess: () => { setDiagSearch(''); setDiagResults([]); diagnosisForm.reset(); },
        });
    }

    return (
        <>
            <Head title={`EMR: ${encounter.patient.name}`} />
            <AppLayout title={`EMR: ${encounter.patient.name}`}>
                <div className="max-w-5xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/doctor/worklist"><ArrowLeft className="size-4" /> Kembali ke Worklist</Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            {isFinal && (
                                <Badge variant="outline">
                                    <LockKeyhole className="size-3" /> Final · {note?.finalized_at ? new Date(note.finalized_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''} WIB
                                </Badge>
                            )}
                            <Badge variant={isFinal ? 'default' : 'secondary'}>{isFinal ? 'Final 🔒' : 'Draft'}</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left sidebar: patient info */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">{encounter.patient.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                    <p>{encounter.patient.medical_record_number}</p>
                                    <p>{encounter.patient.gender === 'male' ? 'Laki-laki' : 'Perempuan'} · {age(encounter.patient.birth_date)} tahun</p>
                                    <p className="text-muted-foreground">{encounter.department?.name}</p>
                                    {encounter.doctor && <p className="text-muted-foreground">dr. {encounter.doctor.user.name}</p>}
                                </CardContent>
                            </Card>

                            {vs && (
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-base">Vital Signs</CardTitle></CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-2 text-sm">
                                        <div><span className="text-muted-foreground">TD</span> <span className="font-medium">{vs.systolic}/{vs.diastolic} mmHg</span></div>
                                        <div><span className="text-muted-foreground">Nadi</span> <span className="font-medium">{vs.pulse} x/mnt</span></div>
                                        <div><span className="text-muted-foreground">Suhu</span> <span className="font-medium">{vs.temperature} °C</span></div>
                                        <div><span className="text-muted-foreground">SpO2</span> <span className="font-medium">{vs.spo2}%</span></div>
                                        <div><span className="text-muted-foreground">RR</span> <span className="font-medium">{vs.respiratory_rate} x/mnt</span></div>
                                        {vs.weight_kg && <div><span className="text-muted-foreground">BB</span> <span className="font-medium">{vs.weight_kg} kg</span></div>}
                                        {vs.height_cm && <div><span className="text-muted-foreground">TB</span> <span className="font-medium">{vs.height_cm} cm</span></div>}
                                    </CardContent>
                                    {vs.chief_complaint && (
                                        <CardContent className="pt-0 text-sm">
                                            <span className="text-muted-foreground">Keluhan:</span> {vs.chief_complaint}
                                        </CardContent>
                                    )}
                                </Card>
                            )}

                            <AllergyBanner allergies={encounter.patient.allergies} hasBeenChecked={encounter.patient.allergies.length > 0} />
                        </div>

                        {/* Right: SOAP & Diagnoses */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* SOAP */}
                            <Card>
                                <CardHeader><CardTitle className="text-base">SOAP</CardTitle></CardHeader>
                                <CardContent>
                                    {isFinal ? (
                                        <div className="space-y-3">
                                            <div><span className="text-sm font-medium text-muted-foreground">Subjective (S)</span><p className="text-sm">{note?.subjective || '-'}</p></div>
                                            <div><span className="text-sm font-medium text-muted-foreground">Objective (O)</span><p className="text-sm">{note?.objective || '-'}</p></div>
                                            <div><span className="text-sm font-medium text-muted-foreground">Assessment (A)</span><p className="text-sm">{note?.assessment || '-'}</p></div>
                                            <div><span className="text-sm font-medium text-muted-foreground">Plan (P)</span><p className="text-sm">{note?.plan || '-'}</p></div>

                                            {/* Addendums */}
                                            {note?.amendments && note.amendments.length > 0 && (
                                                <div className="mt-4 space-y-2">
                                                    <Separator />
                                                    <p className="text-sm font-medium">Addendum</p>
                                                    {note.amendments.map((a) => (
                                                        <div key={a.id} className="border-l-4 border-amber-500 pl-3 text-sm">
                                                            <p>{a.content}</p>
                                                            <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add addendum */}
                                            <Separator />
                                            <form
                                                onSubmit={(e) => { e.preventDefault(); addendumForm.post(`/doctor/emr/${encounter.uuid}/addendum`); }}
                                                className="flex gap-2"
                                            >
                                                <Textarea
                                                    placeholder="Tambah addendum..."
                                                    value={addendumForm.data.content}
                                                    onChange={(e) => addendumForm.setData('content', e.target.value)}
                                                    className="flex-1"
                                                    rows={2}
                                                />
                                                <Button type="submit" size="sm" disabled={addendumForm.processing || !addendumForm.data.content}>
                                                    <Plus className="size-4" /> Tambah
                                                </Button>
                                            </form>
                                        </div>
                                    ) : (
                                        <form onSubmit={saveDraft} className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <Label>Subjective (S) <span className="text-red-500">*</span></Label>
                                                <Textarea rows={3} placeholder="Keluhan utama, riwayat penyakit sekarang, riwayat penyakit dahulu..." value={soapForm.data.subjective} onChange={(e) => soapForm.setData('subjective', e.target.value)} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label>Objective (O)</Label>
                                                <Textarea rows={3} placeholder="Pemeriksaan fisik, hasil lab..." value={soapForm.data.objective} onChange={(e) => soapForm.setData('objective', e.target.value)} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label>Assessment (A) <span className="text-red-500">*</span></Label>
                                                <Textarea rows={3} placeholder="Diagnosa kerja, diagnosa banding..." value={soapForm.data.assessment} onChange={(e) => soapForm.setData('assessment', e.target.value)} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label>Plan (P)</Label>
                                                <Textarea rows={3} placeholder="Rencana terapi, rencana pemeriksaan lanjutan..." value={soapForm.data.plan} onChange={(e) => soapForm.setData('plan', e.target.value)} />
                                            </div>
                                            <div className="flex justify-between pt-2">
                                                <Button type="submit" variant="outline" disabled={soapForm.processing}>
                                                    <Save className="size-4" /> Simpan Draft
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button type="button" className="bg-primary">
                                                            <LockKeyhole className="size-4" /> Finalisasi
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Finalisasi catatan?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Setelah difinalisasi, catatan klinis tidak dapat diubah. Koreksi hanya melalui addendum.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => {
                                                                    const form = document.createElement('form');
                                                                    form.method = 'POST';
                                                                    form.action = `/doctor/emr/${encounter.uuid}/finalize`;
                                                                    const csrfInput = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
                                                                    if (csrfInput) {
                                                                        const input = document.createElement('input');
                                                                        input.type = 'hidden';
                                                                        input.name = '_token';
                                                                        input.value = csrfInput.content;
                                                                        form.appendChild(input);
                                                                    }
                                                                    document.body.appendChild(form);
                                                                    form.submit();
                                                                }}
                                                            >
                                                                Ya, Finalisasi
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Diagnoses */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base">Diagnosa</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {encounter.diagnoses.length > 0 && (
                                        <div className="mb-4 space-y-1">
                                            {encounter.diagnoses.map((d) => (
                                                <div key={d.id} className="flex items-center justify-between rounded border px-3 py-1.5 text-sm">
                                                    <div>
                                                        <span className="font-mono">{d.icd10_code.code}</span>
                                                        <span className="ml-2">{d.icd10_code.description_id || d.icd10_code.description_en}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={d.type === 'primary' ? 'default' : 'secondary'}>
                                                            {d.type === 'primary' ? 'Utama' : 'Sekunder'}
                                                        </Badge>
                                                        {!isFinal && (
                                                            <Link
                                                                href={`/diagnoses/${encounter.uuid}/${d.id}`}
                                                                method="delete"
                                                                as="button"
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="size-3" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {!isFinal && (
                                        <div>
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1 relative">
                                                    <Label className="sr-only">Cari ICD-10</Label>
                                                    <Input
                                                        placeholder="Cari kode atau nama ICD-10..."
                                                        value={diagSearch}
                                                        onChange={(e) => setDiagSearch(e.target.value)}
                                                    />
                                                    {diagResults.length > 0 && (
                                                        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg max-h-48 overflow-auto">
                                                            {diagResults.map((c) => (
                                                                <button
                                                                    key={c.id}
                                                                    type="button"
                                                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                                                                    onClick={() => {
                                                                        diagnosisForm.setData('icd10_code_id', String(c.id));
                                                                        addDiagnosis();
                                                                    }}
                                                                >
                                                                    <span className="font-mono font-medium">{c.code}</span>
                                                                    <span className="flex-1 truncate">{c.description_id || c.description_en}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <Select
                                                    value={diagnosisForm.data.type}
                                                    onValueChange={(v) => diagnosisForm.setData('type', v)}
                                                >
                                                    <SelectTrigger className="w-28">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="primary">Utama</SelectItem>
                                                        <SelectItem value="secondary">Sekunder</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button size="sm" onClick={addDiagnosis} disabled={!diagnosisForm.data.icd10_code_id}>
                                                    <Plus className="size-4" /> Tambah
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Prescriptions */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base"><Pill className="size-4 inline" /> E-Resep</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {encounter.prescriptions.length > 0 && (
                                        <div className="mb-4 space-y-2">
                                            {encounter.prescriptions.map((rx) => (
                                                <div key={rx.id} className="rounded border px-3 py-2 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant="secondary">{rx.status}</Badge>
                                                    </div>
                                                    {rx.items.map((i) => (
                                                        <div key={i.id} className="mt-1 text-muted-foreground">
                                                            {i.medicine_name_snapshot} — {i.dosage} — {i.quantity}x
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {!isFinal && (
                                        <div className="space-y-3">
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1 relative">
                                                    <Label className="sr-only">Cari obat</Label>
                                                    <Input
                                                        placeholder="Cari nama obat atau generik..."
                                                        value={medSearch}
                                                        onChange={(e) => setMedSearch(e.target.value)}
                                                    />
                                                    {medResults.length > 0 && !selectedMed && (
                                                        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg max-h-48 overflow-auto">
                                                            {medResults.map((m) => (
                                                                <button
                                                                    key={m.id}
                                                                    type="button"
                                                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                                                                    onClick={() => setSelectedMed(m)}
                                                                >
                                                                    <span className="font-medium">{m.name}</span>
                                                                    <span className="ml-auto text-xs text-muted-foreground">
                                                                        Stok: <span className={m.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>{m.stock_quantity}</span> · Rp {m.selling_price.toLocaleString('id-ID')}
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {selectedMed && (
                                                <div className="flex items-end gap-2 rounded border bg-muted p-3">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{selectedMed.name} <span className="text-xs text-muted-foreground">({selectedMed.unit}, stok: {selectedMed.stock_quantity})</span></p>
                                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                                            <div>
                                                                <Label className="text-xs">Jumlah</Label>
                                                                <Input type="number" min="1" value={rxQty} onChange={(e) => setRxQty(e.target.value)} className="h-8 text-sm" />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">Dosis <span className="text-red-500">*</span></Label>
                                                                <Input placeholder="3x1" value={rxDosage} onChange={(e) => setRxDosage(e.target.value)} className="h-8 text-sm" />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">Aturan Pakai</Label>
                                                                <Input placeholder="Sesudah makan" value={rxInstruction} onChange={(e) => setRxInstruction(e.target.value)} className="h-8 text-sm" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" onClick={addRxItem}><Plus className="size-4" /></Button>
                                                </div>
                                            )}

                                            {pendingItems.length > 0 && (
                                                <div className="rounded border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Obat</TableHead>
                                                                <TableHead>Dosis</TableHead>
                                                                <TableHead className="text-center">Qty</TableHead>
                                                                <TableHead className="w-8"></TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {pendingItems.map((item, idx) => (
                                                                <TableRow key={idx}>
                                                                    <TableCell className="text-sm">{item.medicine_name}</TableCell>
                                                                    <TableCell className="text-sm">{item.dosage}</TableCell>
                                                                    <TableCell className="text-center text-sm">{item.quantity}</TableCell>
                                                                    <TableCell>
                                                                        <button onClick={() => removeRxItem(idx)} className="text-red-600"><Trash2 className="size-3" /></button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                    <div className="p-2">
                                                        <Button onClick={submitRx} disabled={rxForm.processing || pendingItems.length === 0} size="sm" className="w-full">
                                                            <Pill className="size-4" /> Kirim Resep ke Farmasi
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Lab Orders */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base"><FlaskConical className="size-4 inline" /> Order Lab</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {encounter.lab_orders.length > 0 && (
                                        <div className="mb-4 space-y-2">
                                            {encounter.lab_orders.map((lo) => (
                                                <div key={lo.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                                                    <div>
                                                        {lo.items.map((i) => (
                                                            <span key={i.id} className="mr-2">{i.test_name_snapshot}</span>
                                                        ))}
                                                    </div>
                                                    <Badge variant="secondary">{lo.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {!isFinal && (
                                        <div className="flex items-end gap-2">
                                            <div className="flex-1">
                                                <Label className="sr-only">Pilih pemeriksaan lab</Label>
                                                <select
                                                    value={labForm.data.lab_test_id}
                                                    onChange={(e) => labForm.setData('lab_test_id', e.target.value)}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                >
                                                    <option value="">Pilih pemeriksaan lab...</option>
                                                    {labTests.map((t) => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <Button size="sm" onClick={submitLab} disabled={labForm.processing || !labForm.data.lab_test_id}>
                                                <FlaskConical className="size-4" /> Order
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
