import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, Flag, Package, Printer, UserCheck } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/shared/app-layout';
import AllergyBanner from '@/components/shared/allergy-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Allergy = { id: number; allergen: string; severity: string };
type Prescription = {
    id: number; status: string; flag_notes: string | null;
    encounter: {
        patient: { id: number; name: string; medical_record_number: string; allergies: Allergy[] };
        department: { id: number; name: string } | null;
        doctor: { user: { id: number; name: string } } | null;
    };
    items: {
        id: number; medicine_name_snapshot: string; quantity: number; dosage: string; instruction: string | null;
        medicine: { id: number; name: string; unit: string; stock_quantity: number; selling_price: number } | null;
    }[];
};

const statusBadge: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    submitted: 'secondary',
    verified: 'default',
    flagged: 'destructive',
    dispensed: 'outline',
    handed_over: 'outline',
};

const statusLabel: Record<string, string> = {
    submitted: 'Diajukan',
    verified: 'Terverifikasi',
    flagged: 'Bermasalah',
    dispensed: 'Dispensing',
    handed_over: 'Diserahkan',
};

function formatRupiah(v: number): string {
    return `Rp ${v.toLocaleString('id-ID')}`;
}

export default function PharmacyReview() {
    const { prescription } = usePage().props as unknown as { prescription: Prescription };
    const [flagNotes, setFlagNotes] = useState('');
    const canVerify = prescription.status === 'submitted' || prescription.status === 'flagged';
    const canDispense = prescription.status === 'verified';
    const canHandOver = prescription.status === 'dispensed';

    return (
        <>
            <Head title="Telaah Resep" />
            <AppLayout title="Telaah Resep">
                <div className="max-w-3xl">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/pharmacy/worklist"><ArrowLeft className="size-4" /> Kembali</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="mb-4 ml-auto">
                        <Link href={`/print/prescription/${prescription.id}`} target="_blank">
                            <Printer className="size-4" /> Cetak Resep
                        </Link>
                    </Button>

                    <AllergyBanner allergies={prescription.encounter.patient.allergies} hasBeenChecked />

                    <Card className="mt-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{prescription.encounter.patient.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {prescription.encounter.patient.medical_record_number} · {prescription.encounter.department?.name}
                                    {prescription.encounter.doctor && <> · dr. {prescription.encounter.doctor.user.name}</>}
                                </p>
                            </div>
                            <Badge variant={statusBadge[prescription.status]}>{statusLabel[prescription.status]}</Badge>
                        </CardHeader>
                        <CardContent>
                            {prescription.flag_notes && (
                                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                                    <span className="font-medium">Catatan masalah:</span> {prescription.flag_notes}
                                </div>
                            )}

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Obat</TableHead>
                                        <TableHead>Dosis</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Harga</TableHead>
                                        <TableHead className="text-center">Stok</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prescription.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <span className="font-medium">{item.medicine_name_snapshot}</span>
                                                {item.instruction && <p className="text-xs text-muted-foreground">{item.instruction}</p>}
                                            </TableCell>
                                            <TableCell>{item.dosage}</TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{formatRupiah(item.medicine?.selling_price ?? 0)}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={item.medicine && item.medicine.stock_quantity >= item.quantity ? 'outline' : 'destructive'}>
                                                    {item.medicine?.stock_quantity ?? '-'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Separator className="my-4" />
                            <div className="flex items-center justify-end gap-2">
                                {canVerify && (
                                    <>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" className="text-amber-600">
                                                    <Flag className="size-4" /> Tandai Masalah
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Tandai resep bermasalah</AlertDialogTitle>
                                                    <AlertDialogDescription>Jelaskan masalah yang ditemukan.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <Textarea
                                                    placeholder="Tulis catatan masalah..."
                                                    value={flagNotes}
                                                    onChange={(e) => setFlagNotes(e.target.value)}
                                                    rows={3}
                                                />
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <form action={`/pharmacy/${prescription.id}/flag`} method="POST">
                                                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />
                                                        <input type="hidden" name="notes" value={flagNotes} />
                                                        <Button type="submit" size="sm" variant="outline" className="text-amber-600" disabled={!flagNotes}>
                                                            Tandai
                                                        </Button>
                                                    </form>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <Link href={`/pharmacy/${prescription.id}/verify`} method="post" as="button" className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
                                            <Check className="size-4" /> Verifikasi
                                        </Link>
                                    </>
                                )}

                                {canDispense && (
                                    <Link href={`/pharmacy/${prescription.id}/dispense`} method="post" as="button" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark">
                                        <Package className="size-4" /> Dispensing
                                    </Link>
                                )}

                                {canHandOver && (
                                    <Link href={`/pharmacy/${prescription.id}/handover`} method="post" as="button" className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
                                        <UserCheck className="size-4" /> Serahkan
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
