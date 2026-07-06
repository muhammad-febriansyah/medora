import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users as UsersIcon,
    UserRoundPlus,
    ClipboardList,
    Stethoscope,
    LogOut,
    Building2,
    FileText,
    Pill,
    Syringe,
    UserCog,
    UserRound,
    Banknote,
    Package,
    Settings,
    AlertTriangle,
    Shield,
    type LucideIcon,
} from 'lucide-react';
import { type ReactNode } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { type User } from '@/types/auth';

type NavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    permission?: string;
};

const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Kunjungan', href: '/encounters', icon: UserRoundPlus, permission: 'patients.view_demographics' },
    { title: 'Worklist Perawat', href: '/nurse/worklist', icon: ClipboardList, permission: 'clinical.write' },
    { title: 'Worklist Dokter', href: '/doctor/worklist', icon: Stethoscope, permission: 'clinical.write' },
    { title: 'Antrian Resep', href: '/pharmacy/worklist', icon: Pill, permission: 'prescriptions.dispense' },
    { title: 'Lab', href: '/lab/worklist', icon: Syringe, permission: 'clinical.view' },
    { title: 'Kasir', href: '/cashier/worklist', icon: Banknote, permission: 'billing.process' },
    { title: 'Rekam Medis', href: '/medical-records/patient-history', icon: FileText, permission: 'clinical.view' },
    { title: 'Audit RM', href: '/medical-records/incomplete', icon: AlertTriangle, permission: 'reports.view' },
    { title: 'Access Log', href: '/medical-records/access-logs', icon: Shield, permission: 'access_logs.view' },
    { title: 'Pengaturan', href: '/settings/clinic', icon: Settings, permission: 'masterdata.manage' },
    { title: 'Data Pasien', href: '/patients', icon: UserRound, permission: 'patients.view_demographics' },
    { title: 'Data Poli', href: '/departments', icon: Building2, permission: 'masterdata.manage' },
    { title: 'Layanan & Tarif', href: '/services', icon: Stethoscope, permission: 'masterdata.manage' },
    { title: 'Stok Obat', href: '/stock', icon: Package, permission: 'masterdata.manage' },
    { title: 'Data Dokter', href: '/doctors', icon: UserCog, permission: 'masterdata.manage' },
    { title: 'Data Obat', href: '/medicines', icon: Pill, permission: 'masterdata.manage' },
    { title: 'ICD-10', href: '/icd10-codes', icon: FileText, permission: 'masterdata.manage' },
    { title: 'Pemeriksaan Lab', href: '/lab-tests', icon: Syringe, permission: 'masterdata.manage' },
    { title: 'Manajemen User', href: '/users', icon: UsersIcon, permission: 'users.manage' },
];

function can(permissions: string[] | undefined, permission: string | undefined): boolean {
    if (!permission) return true;
    return permissions?.includes(permission) ?? false;
}

function initials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function AppLayout({ children, title }: { children: ReactNode; title: string }) {
    const { auth } = usePage().props;
    const user = auth?.user as User | undefined;
    const permissions = user?.permissions;
    const roles = user?.roles ?? [];

    const visibleNav = navItems.filter((item) => can(permissions, item.permission));

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center gap-2 px-2 py-1.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            M
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-sidebar-foreground">Medora</span>
                            <span className="text-xs text-sidebar-foreground/60">RME Klinik</span>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {visibleNav.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg">
                                        <Avatar>
                                            <AvatarFallback>{user ? initials(user.name) : '?'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm font-medium">{user?.name}</span>
                                            <span className="text-xs text-muted-foreground">{roles.join(', ')}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" className="w-56">
                                    <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/logout" method="post" as="button" className="w-full cursor-pointer">
                                            <LogOut />
                                            <span>Keluar</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-6">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <h1 className="text-lg font-semibold">{title}</h1>
                </header>
                <div className="max-w-screen-2xl mx-auto px-6 py-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
