"use client";
import Link from "next/link";
import { Home, Table, ExternalLink, Plug } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import UsageButton from "./UsageButton";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: <Home size={20} />, label: "Home", href: "/dashboard" },
    { icon: <Table size={20} />, label: "Forms", href: "/forms" },
    { icon: <Plug size={20} />, label: "Integrations", href: "/integrations" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <SidebarMenu className="flex flex-col h-full p-4 border-t md:border-0">
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={isActive(item.href)}>
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className="md:hidden">
          <SidebarMenuButton asChild>
            <a
              href="https://heysheet.mintlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={18} />
              Documentation
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </div>
      <UsageButton />
    </SidebarMenu>
  );
}
