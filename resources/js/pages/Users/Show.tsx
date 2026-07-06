import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type User } from '@/types/auth';

type Role = { id: number; name: string };
type UserWithRoles = User & { roles: Role[]; created_at: string };

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function UsersShow() {
    const { user } = usePage().props as unknown as { user: UserWithRoles };

    return (
        <>
            <Head title={user.name} />
            <AppLayout title={`Detail User: ${user.name}`}>
                <div className="max-w-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/users">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/users/${user.id}/edit`}>
                                <Pencil className="size-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi User</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Nama</span>
                                <span className="font-medium">{user.name}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <span className="font-medium">{user.email}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Role</span>
                                <div className="flex flex-wrap gap-1">
                                    {user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <Badge key={role.id} variant="secondary">{role.name}</Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Tidak ada role</span>
                                    )}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground">Terdaftar</span>
                                <span className="font-medium">{formatDate(user.created_at)} WIB</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
