import { Head, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useEffect } from 'react';

type Clinic = { name: string; address: string | null; phone: string | null; license_number: string | null };
type Prescription = {
    encounter: {
        patient: { name: string; medical_record_number: string; birth_date: string };
        doctor: { user: { name: string } } | null;
    };
    items: { medicine_name_snapshot: string; quantity: number; dosage: string; instruction: string | null }[];
};

function today(): string { return new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }); }

export default function PrintPrescription() {
    const { prescription, clinic } = usePage().props as unknown as { prescription: Prescription; clinic: Clinic };

    useEffect(() => { window.print(); }, []);

    return (
        <div className="p-8 max-w-xl mx-auto text-sm print:p-4">
            <Head title="Resep" />
            <div className="text-center mb-4 no-print:hidden">
                <button onClick={() => window.print()} className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm text-white">
                    <Printer className="size-4" /> Cetak
                </button>
            </div>

            <div className="border-b-2 border-black pb-3 mb-4">
                <h2 className="text-xl font-bold text-center">{clinic?.name || 'Nama Klinik'}</h2>
                <p className="text-center text-xs">{clinic?.address || ''}</p>
                <p className="text-center text-xs">Telp: {clinic?.phone || ''}</p>
            </div>

            <h3 className="text-center font-bold text-lg mb-4">RESEP</h3>

            <div className="mb-4 text-sm">
                <table className="w-full">
                    <tbody>
                        <tr><td className="w-20">Pasien</td><td>: {prescription.encounter.patient.name}</td></tr>
                        <tr><td>No. RM</td><td>: {prescription.encounter.patient.medical_record_number}</td></tr>
                        <tr><td>Tanggal</td><td>: {today()}</td></tr>
                    </tbody>
                </table>
            </div>

            <table className="w-full border-collapse border border-black mb-4 text-sm">
                <thead>
                    <tr className="border-b border-black">
                        <th className="border border-black px-2 py-1 text-left w-8">R/</th>
                        <th className="border border-black px-2 py-1 text-left">Obat</th>
                        <th className="border border-black px-2 py-1 text-center w-16">Jumlah</th>
                        <th className="border border-black px-2 py-1 text-left">Aturan Pakai</th>
                    </tr>
                </thead>
                <tbody>
                    {prescription.items.map((item, i) => (
                        <tr key={i}>
                            <td className="border border-black px-2 py-1">{i + 1}</td>
                            <td className="border border-black px-2 py-1">{item.medicine_name_snapshot}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.quantity}</td>
                            <td className="border border-black px-2 py-1 text-xs">{item.dosage}{item.instruction ? `, ${item.instruction}` : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-12 text-right">
                <p>Dokter,</p>
                <p className="mt-8 font-bold">{prescription.encounter.doctor?.user.name || ''}</p>
            </div>
        </div>
    );
}
