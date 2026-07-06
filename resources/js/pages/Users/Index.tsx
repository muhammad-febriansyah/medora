import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { type ReactNode } from 'react';
import AppLayout from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { type User } from '@/types/auth';

type Role = { id: number; name: string };
type UserWithRoles = User & { roles: Role[]; deleted_at: string | null };

export default function UsersIndex() {
    const { users, roles, filters } = usePage().props as unknown as {
        users: { data: UserWithRoles[]; current_page: number; last_page: number; from: number; to: number; total: number; links: { url: string | null; label: string; active: boolean }[] };
        roles: Role[];
        filters: { search: string };
    };

    return (
        <>
            <Head title="Manajemen User" />
            <AppLayout title="Manajemen User">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="search"
                            placeholder="Cari nama atau email..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 2 || value.length === 0) {
                                    window.location.href = value
                                        ? `/users?search=${encodeURIComponent(value)}`
                                        : '/users';
                                }
                            }}
                        />
                        <Button asChild>
                            <Link href="/users/create">
                                <Plus className="size-4" />
                                Tambah User
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                Belum ada data user. <Link href="/users/create" className="font-medium text-primary underline">Tambah User</Link>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user) => (
                                            <TableRow key={user.id} className="cursor-pointer">
                                                <TableCell className="font-medium">
                                                    <Link href={`/users/${user.id}`}>{user.name}</Link>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map((role) => (
                                                            <Badge key={role.id} variant="secondary">{role.name}</Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="size-8">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/users/${user.id}`}>
                                                                    <Eye className="size-4" /> Lihat
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/users/${user.id}/edit`}>
                                                                    <Pencil className="size-4" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {!user.deleted_at && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={`/users/${user.id}`}
                                                                        method="delete"
                                                                        as="button"
                                                                        className="text-red-600"
                                                                    >
                                                                        <Trash2 className="size-4" /> Hapus
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {users.from}–{users.to} dari {users.total} user
                            </p>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                    >
                                        {link.url ? (
                                            <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
