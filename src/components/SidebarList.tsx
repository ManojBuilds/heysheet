'use client'

import { usePathname } from "next/navigation";
import { Home, Table, Plug } from "lucide-react";
import {
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

export const MENU_ITEMS = [
    { icon: <Home size={20} />, label: "Home", href: "/dashboard" },
    { icon: <Table size={20} />, label: "Forms", href: "/forms" },
    { icon: <Plug size={20} />, label: "Integrations", href: "/integrations" },
];

export const SidebarList = () => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    return (
        <>
            {MENU_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link href={item.href}>
                            {item.icon}
                            {item.label}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    )
}
