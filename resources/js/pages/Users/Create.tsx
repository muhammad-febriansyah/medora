import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type Role = { id: number; name: string };

export default function UsersCreate() {
    const { roles } = usePage().props as unknown as { roles: Role[] };
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/users');
    }

    function toggleRole(role: string) {
        setData('roles', data.roles.includes(role)
            ? data.roles.filter((r) => r !== role)
            : [...data.roles, role]);
    }

    return (
        <>
            <Head title="Tambah User" />
            <AppLayout title="Tambah User">
                <div className="max-w-2xl">
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/users">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data User Baru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Nama <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Budi Santoso"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Contoh: budi@medora.id"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Min. 8 karakter"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="password_confirmation">Konfirmasi Password <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            placeholder="Ulangi password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Role</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {roles.map((role) => (
                                            <label key={role.id} className="flex items-center gap-2 text-sm">
                                                <Checkbox
                                                    checked={data.roles.includes(role.name)}
                                                    onCheckedChange={() => toggleRole(role.name)}
                                                />
                                                {role.name}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.roles && <p className="text-sm text-red-600">{errors.roles}</p>}
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" asChild>
                                        <Link href="/users">Batal</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <Save className="size-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="size-4" />
                                                Simpan
                                            </>
                                        )}
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
