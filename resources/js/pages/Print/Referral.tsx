import { Head, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useEffect } from 'react';

type Clinic = { name: string; address: string | null; phone: string | null; license_number: string | null };
type Encounter = {
    patient: { name: string; medical_record_number: string; birth_date: string; gender: string; address: string };
    doctor: { user: { name: string; sip_number: string } } | null;
    diagnoses: { icd10_code: { code: string; description_id: string | null } }[];
};

function age(birthDate: string): number {
    const bd = new Date(birthDate);
    const today = new Date();
    let a = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
    return a;
}

export default function PrintReferral() {
    const { encounter, clinic } = usePage().props as unknown as { encounter: Encounter; clinic: Clinic };

    useEffect(() => { window.print(); }, []);

    return (
        <div className="p-8 max-w-xl mx-auto text-sm print:p-4">
            <Head title="Surat Rujukan" />
            <div className="text-center mb-4 no-print:hidden">
                <button onClick={() => window.print()} className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm text-white">
                    <Printer className="size-4" /> Cetak
                </button>
            </div>
            <div className="border-b-2 border-black pb-3 mb-4">
                <h2 className="text-xl font-bold text-center">{clinic?.name || 'Nama Klinik'}</h2>
                <p className="text-center text-xs">{clinic?.address || ''}</p>
            </div>
            <h3 className="text-center font-bold text-lg mb-6">SURAT RUJUKAN</h3>

            <table className="w-full mb-4">
                <tbody>
                    <tr><td className="w-32">Nama Pasien</td><td>: {encounter.patient.name}</td></tr>
                    <tr><td>No. RM</td><td>: {encounter.patient.medical_record_number}</td></tr>
                    <tr><td>Umur</td><td>: {age(encounter.patient.birth_date)} tahun</td></tr>
                    <tr><td>JK</td><td>: {encounter.patient.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</td></tr>
                    <tr><td>Alamat</td><td>: {encounter.patient.address}</td></tr>
                </tbody>
            </table>

            <h4 className="font-bold mb-2">Diagnosa:</h4>
            <ul className="list-disc pl-5 mb-4">
                {encounter.diagnoses.map((d) => (
                    <li key={d.icd10_code.code}>{d.icd10_code.code} — {d.icd10_code.description_id || d.icd10_code.description_en || ''}</li>
                ))}
                {encounter.diagnoses.length === 0 && <li>Belum ada diagnosa</li>}
            </ul>

            <div className="border border-black p-3 mb-4">
                <h4 className="font-bold">Mohon dilakukan:</h4>
                <p className="text-muted-foreground text-xs">(Diisi oleh dokter perujuk)</p>
                <div className="h-16"></div>
            </div>

            <p>Demikian surat rujukan ini dibuat. Atas perhatian dan kerjasamanya diucapkan terima kasih.</p>

            <div className="mt-12 flex justify-between">
                <div>
                    <p className="mb-8">Tujuan Rujukan:</p>
                    <p>___________________________</p>
                </div>
                <div className="text-center">
                    <p>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold mb-8">{encounter.doctor?.user.name || ''}</p>
                    <p className="text-xs">SIP: {encounter.doctor?.sip_number || ''}</p>
                </div>
            </div>
        </div>
    );
}
