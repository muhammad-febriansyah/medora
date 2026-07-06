import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import AllergyBanner from '@/components/shared/allergy-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Allergy = { id: number; allergen: string; severity: 'mild' | 'moderate' | 'severe'; notes: string | null };
type Patient = {
    id: number; medical_record_number: string; nik: string | null;
    name: string; birth_date: string; birth_place: string; gender: string;
    address: string; phone: string; blood_type: string | null;
    occupation: string | null; guardian_name: string | null; guardian_phone: string | null;
    allergies: (Allergy & { recorded_by: { id: number; name: string } | null })[];
    created_at: string;
};

function age(birthDate: string): number {
    const bd = new Date(birthDate);
    const today = new Date();
    let a = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
    return a;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PatientsShow() {
    const { patient, canManageAllergies } = usePage().props as unknown as {
        patient: Patient;
        canManageAllergies: boolean;
    };

    const allergyForm = useForm({
        allergen: '',
        severity: 'mild' as 'mild' | 'moderate' | 'severe',
        notes: '',
    });

    function addAllergy(e: React.FormEvent) {
        e.preventDefault();
        allergyForm.post(`/patients/${patient.id}/allergies`, {
            onSuccess: () => allergyForm.reset(),
        });
    }

    return (
        <>
            <Head title={patient.name} />
            <AppLayout title={`Detail Pasien: ${patient.name}`}>
                <div className="max-w-3xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/patients"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/patients/${patient.id}/edit`}><Pencil className="size-4" /> Edit</Link>
                        </Button>
                    </div>

                    <AllergyBanner
                        allergies={patient.allergies}
                        hasBeenChecked={patient.allergies.length > 0}
                    />

                    <Card className="mt-4">
                        <CardHeader><CardTitle>Informasi Pasien</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">No. RM</span>
                                    <span className="font-mono font-bold text-lg">{patient.medical_record_number}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">NIK</span>
                                    <span className="font-mono">{patient.nik ?? '-'}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Nama</span>
                                <span className="font-medium text-lg">{patient.name}</span>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Tanggal Lahir</span>
                                    <span className="font-medium">{new Date(patient.birth_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Umur</span>
                                    <span className="font-medium">{age(patient.birth_date)} tahun</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">JK</span>
                                    <Badge variant="secondary">{patient.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</Badge>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Tempat Lahir</span>
                                <span className="font-medium">{patient.birth_place}</span>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Telepon</span>
                                    <span className="font-medium">{patient.phone}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Golongan Darah</span>
                                    <span className="font-medium">{patient.blood_type ?? '-'}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Alamat</span>
                                <span className="font-medium">{patient.address}</span>
                            </div>
                            {patient.occupation && (
                                <>
                                    <Separator />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">Pekerjaan</span>
                                        <span className="font-medium">{patient.occupation}</span>
                                    </div>
                                </>
                            )}
                            {patient.guardian_name && (
                                <>
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-muted-foreground">Penanggung Jawab</span>
                                            <span className="font-medium">{patient.guardian_name}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-muted-foreground">Telepon PJ</span>
                                            <span className="font-medium">{patient.guardian_phone ?? '-'}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Terdaftar</span>
                                <span className="font-medium">{formatDate(patient.created_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Alergi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {patient.allergies.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada alergi tercatat.</p>
                            ) : (
                                <div className="space-y-2">
                                    {patient.allergies.map((a) => (
                                        <div key={a.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                                            <div>
                                                <span className="font-medium">{a.allergen}</span>
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                    ({a.severity === 'mild' ? 'Ringan' : a.severity === 'moderate' ? 'Sedang' : 'Berat'})
                                                </span>
                                                {a.notes && <p className="text-sm text-muted-foreground">{a.notes}</p>}
                                            </div>
                                            {canManageAllergies && (
                                                <Link
                                                    href={`/patients/${patient.id}/allergies/${a.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {canManageAllergies && (
                                <form onSubmit={addAllergy} className="mt-4 flex items-end gap-2">
                                    <div className="flex-1">
                                        <Label htmlFor="allergen" className="sr-only">Alergen</Label>
                                        <Input
                                            id="allergen"
                                            placeholder="Nama alergen (contoh: Penisilin)"
                                            value={allergyForm.data.allergen}
                                            onChange={(e) => allergyForm.setData('allergen', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Select value={allergyForm.data.severity} onValueChange={(v) => allergyForm.setData('severity', v as 'mild' | 'moderate' | 'severe')}>
                                            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mild">Ringan</SelectItem>
                                                <SelectItem value="moderate">Sedang</SelectItem>
                                                <SelectItem value="severe">Berat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" size="sm" disabled={allergyForm.processing || !allergyForm.data.allergen}>
                                        <Plus className="size-4" /> Tambah
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
