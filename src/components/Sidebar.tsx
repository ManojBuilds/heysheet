"use client";
import { useState } from "react";
import Link from "next/link";
import { Home, Table, Settings, Plus, FileText, Plug } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import UsageButton from "./UsageButton";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { icon: <Home size={20} />, label: "Home", href: "/dashboard" },
    { icon: <Table size={20} />, label: "Forms", href: "/forms" },
    { icon: <Plug size={20} />, label: "Integrations", href: "/integrations" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={cn(
        "fixed left-0 top-16 bottom-0 h-[calc(100svh-4rem)] bg-background border-r",
        "transition-all duration-200 ease-in-out p-4 w-[280px]",
      )}
    >
      <nav className="flex flex-col gap-2 p-2 h-full">
        <div className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md text-sm gap-2 px-2.5 py-1.5",
                "transition-all duration-300 ease-in-out",
                "hover:bg-secondary text-muted-foreground",
                isActive(item.href) && "bg-muted text-primary ",
              )}
            >
              <span className={cn("flex items-center justify-center")}>
                {item.icon}
              </span>
              <span
                className={cn("transition-all duration-300 whitespace-nowrap")}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <UsageButton />
      </nav>
    </div>
  );
}
