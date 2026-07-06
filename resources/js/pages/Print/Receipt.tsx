import { Head, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useEffect } from 'react';

type Clinic = { name: string; address: string | null; phone: string | null; license_number: string | null };
type Encounter = {
    patient: { name: string; medical_record_number: string };
    department: { name: string } | null;
    invoice: {
        invoice_number: string;
        total: number; discount_amount: number;
        items: { item_name_snapshot: string; category: string; quantity: number; line_total: number }[];
        payments: { method: string; amount: number; amount_tendered: number | null; change_amount: number | null; received_by: number; paid_at: string }[] | null;
    } | null;
};

function formatRupiah(v: number): string { return `Rp ${v.toLocaleString('id-ID')}`; }
function today(): string { return new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }); }

export default function PrintReceipt() {
    const { encounter, clinic } = usePage().props as unknown as { encounter: Encounter; clinic: Clinic };

    useEffect(() => { window.print(); }, []);

    return (
        <div className="p-6 max-w-[72mm] mx-auto text-xs font-mono print:p-0 print:max-w-none">
            <Head title="Kuitansi" />

            <div className="text-center mb-3 no-print:hidden">
                <button onClick={() => window.print()} className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm text-white">
                    <Printer className="size-4" /> Cetak
                </button>
            </div>

            <div className="border-b border-dashed pb-2 mb-2 text-center">
                <h2 className="font-bold text-sm">{clinic?.name || 'Nama Klinik'}</h2>
                <p className="text-[10px]">{clinic?.address || ''}</p>
                <p className="text-[10px]">{clinic?.license_number ? `Izin: ${clinic.license_number}` : ''}</p>
            </div>

            <h3 className="text-center font-bold mb-2">KUITANSI PEMBAYARAN</h3>

            <div className="mb-2">
                <table className="w-full text-[10px]">
                    <tbody>
                        <tr><td>No. Invoice</td><td className="text-right">{encounter.invoice?.invoice_number}</td></tr>
                        <tr><td>Pasien</td><td className="text-right font-bold">{encounter.patient.name}</td></tr>
                        <tr><td>No. RM</td><td className="text-right">{encounter.patient.medical_record_number}</td></tr>
                        <tr><td>Poli</td><td className="text-right">{encounter.department?.name}</td></tr>
                        <tr><td>Tanggal</td><td className="text-right">{today()}</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="border-t border-dashed pt-1 mb-2">
                {encounter.invoice?.items && encounter.invoice.items.length > 0 ? (
                    <table className="w-full text-[10px]">
                        <tbody>
                            {encounter.invoice.items.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.item_name_snapshot}</td>
                                    <td className="text-center">{item.quantity > 1 ? `x${item.quantity}` : ''}</td>
                                    <td className="text-right">{formatRupiah(item.line_total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Belum ada item.</p>
                )}
            </div>

            <div className="border-t border-b border-dashed py-1 mb-3">
                <table className="w-full text-xs">
                    <tbody>
                        <tr className="font-bold">
                            <td>TOTAL</td>
                            <td className="text-right">{encounter.invoice ? formatRupiah(encounter.invoice.total) : 'Rp 0'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p className="text-center text-[10px] mb-3">Terima kasih — Semoga lekas sembuh</p>
        </div>
    );
}
