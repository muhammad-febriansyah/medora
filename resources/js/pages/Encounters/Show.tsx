import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Ban, TriangleAlert } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import AllergyBanner from '@/components/shared/allergy-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

type Allergy = { id: number; allergen: string; severity: 'mild' | 'moderate' | 'severe' };
type Encounter = {
    id: number; uuid: string; encounter_date: string; visit_type: string;
    payer_type: string; status: string; cancellation_reason: string | null;
    patient: { id: number; name: string; medical_record_number: string; birth_date: string; gender: string; allergies: Allergy[] };
    department: { id: number; name: string } | null;
    doctor: { user: { id: number; name: string } } | null;
    registered_by: { id: number; name: string } | null;
    queues: { id: number; queue_number: string; status: string; queue_type: string }[];
    invoice: { id: number; invoice_number: string; status: string; total: number; items: { id: number; category: string; item_name_snapshot: string; unit_price_snapshot: number; quantity: number; line_total: number }[] } | null;
    created_at: string;
};

const statusBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    registered: 'secondary',
    nurse_assessment: 'secondary',
    in_consultation: 'default',
    waiting_lab: 'outline',
    in_pharmacy: 'outline',
    waiting_payment: 'outline',
    completed: 'outline',
    cancelled: 'destructive',
};

const statusLabel: Record<string, string> = {
    registered: 'Terdaftar',
    nurse_assessment: 'Asesmen Perawat',
    in_consultation: 'Konsultasi',
    waiting_lab: 'Menunggu Lab',
    in_pharmacy: 'Farmasi',
    waiting_payment: 'Menunggu Bayar',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

function age(birthDate: string): number {
    const bd = new Date(birthDate);
    const today = new Date();
    let a = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
    return a;
}

function formatRupiah(v: number): string {
    return `Rp ${v.toLocaleString('id-ID')}`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function EncountersShow() {
    const { encounter } = usePage().props as unknown as { encounter: Encounter };
    const [cancelReason, setCancelReason] = useState('');
    const { data, setData, post, processing } = useForm({ reason: '' });

    const canCancel = ['registered', 'nurse_assessment'].includes(encounter.status);

    function handleCancel() {
        post(`/encounters/${encounter.uuid}/cancel`);
    }

    return (
        <>
            <Head title={`Kunjungan ${encounter.patient.name}`} />
            <AppLayout title={`Detail Kunjungan: ${encounter.patient.name}`}>
                <div className="max-w-3xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/encounters"><ArrowLeft className="size-4" /> Kembali</Link>
                        </Button>
                        {canCancel && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-red-600">
                                        <Ban className="size-4" /> Batalkan Kunjungan
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Batalkan kunjungan atas nama <strong>{encounter.patient.name}</strong>?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Kunjungan yang dibatalkan tidak dapat dikembalikan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="reason">Alasan pembatalan <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            id="reason"
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            placeholder="Tulis alasan pembatalan..."
                                            rows={2}
                                        />
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleCancel}
                                            disabled={processing || !data.reason}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Ya, Batalkan
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>

                    <AllergyBanner
                        allergies={encounter.patient.allergies}
                        hasBeenChecked={encounter.patient.allergies.length > 0}
                    />

                    <Card className="mt-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Informasi Kunjungan</CardTitle>
                            <Badge variant={statusBadge[encounter.status] ?? 'secondary'}>{statusLabel[encounter.status] ?? encounter.status}</Badge>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Pasien</span>
                                    <span className="font-medium">
                                        <Link href={`/patients/${encounter.patient.id}`} className="text-primary">{encounter.patient.name}</Link>
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {encounter.patient.medical_record_number} · {encounter.patient.gender === 'male' ? 'L' : 'P'} · {age(encounter.patient.birth_date)}th
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Nomor Antrian</span>
                                    <span className="font-mono font-bold text-lg">
                                        {encounter.queues.find(q => q.queue_type === 'poli')?.queue_number ?? '-'}
                                    </span>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Poli</span>
                                    <span className="font-medium">{encounter.department?.name ?? '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Dokter</span>
                                    <span className="font-medium">{encounter.doctor?.user.name ?? '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Tanggal</span>
                                    <span className="font-medium">{new Date(encounter.encounter_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Jenis Kunjungan</span>
                                    <Badge variant="secondary">{encounter.visit_type === 'new' ? 'Baru' : 'Kontrol'}</Badge>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Metode Bayar</span>
                                    <Badge variant="secondary">{encounter.payer_type === 'self' ? 'Umum' : 'Asuransi Manual'}</Badge>
                                </div>
                            </div>
                            {encounter.status === 'cancelled' && encounter.cancellation_reason && (
                                <>
                                    <Separator />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-muted-foreground">Alasan Pembatalan</span>
                                        <span className="font-medium text-red-600">{encounter.cancellation_reason}</span>
                                    </div>
                                </>
                            )}
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Didaftarkan oleh</span>
                                <span className="font-medium">{encounter.registered_by?.name ?? '-'} · {formatDate(encounter.created_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>

                    {encounter.invoice && (
                        <Card className="mt-6">
                            <CardHeader><CardTitle>Tagihan</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-1 mb-4">
                                    <span className="text-sm text-muted-foreground">No. Invoice</span>
                                    <span className="font-mono font-medium">{encounter.invoice.invoice_number}</span>
                                </div>
                                {encounter.invoice.items.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead>Kategori</TableHead>
                                                <TableHead className="text-right">Harga</TableHead>
                                                <TableHead className="text-center">Qty</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {encounter.invoice.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.item_name_snapshot}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{item.category}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">{formatRupiah(item.unit_price_snapshot)}</TableCell>
                                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                                    <TableCell className="text-right font-medium">{formatRupiah(item.line_total)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Belum ada item tagihan.</p>
                                )}
                                <Separator className="my-4" />
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground">Total</span>
                                    <p className="text-2xl font-bold tabular-nums">{formatRupiah(encounter.invoice.total)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
