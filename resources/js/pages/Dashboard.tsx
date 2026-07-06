import { Head, usePage } from '@inertiajs/react';
import { Users as UsersIcon, Activity, Pill, Clock, Banknote, UserRoundPlus } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function formatRupiah(v: number): string {
    return `Rp ${v.toLocaleString('id-ID')}`;
}

export default function Dashboard() {
    const { stats, visitsByDepartment } = usePage().props as unknown as {
        stats: {
            visitsToday: number; revenueToday: number; waitingQueue: number;
            criticalStock: number; newPatientsToday: number;
        };
        visitsByDepartment: Record<string, number>;
    };

    return (
        <>
            <Head title="Dashboard" />
            <AppLayout title="Dashboard">
                <div className="flex flex-col gap-6">
                    <p className="text-sm text-muted-foreground">
                        Selamat datang di Medora — Sistem Rekam Medis Elektronik
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Kunjungan Hari Ini</CardDescription>
                                <CardTitle className="text-3xl tabular-nums">{stats.visitsToday}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Activity className="size-4" /> Total kunjungan
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Pendapatan Hari Ini</CardDescription>
                                <CardTitle className="text-2xl tabular-nums">{formatRupiah(stats.revenueToday)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Banknote className="size-4" /> Semua metode
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Antrian Menunggu</CardDescription>
                                <CardTitle className="text-3xl tabular-nums">{stats.waitingQueue}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="size-4" /> Poli
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Stok Kritis</CardDescription>
                                <CardTitle className="text-3xl tabular-nums">{stats.criticalStock}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Pill className="size-4" /> Obat ≤ stok minimum
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Pasien Baru Hari Ini</CardDescription>
                                <CardTitle className="text-3xl tabular-nums">{stats.newPatientsToday}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <UserRoundPlus className="size-4" /> Terdaftar
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {Object.keys(visitsByDepartment).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Kunjungan per Poli</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {Object.entries(visitsByDepartment).map(([dept, count]) => (
                                        <div key={dept} className="flex items-center justify-between">
                                            <span>{dept || 'Tanpa Poli'}</span>
                                            <span className="font-medium tabular-nums">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
