import { ExternalLink } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import UsageButton from "./UsageButton";
import { SidebarList } from "./SidebarList";
import { config } from "@/config";

export default function Sidebar() {
  return (
    <SidebarMenu className="flex flex-col h-full p-4 border-t md:border-0">
      <div className="flex-1 space-y-2">
        <SidebarList />
        <SidebarMenuItem className="md:hidden">
          <SidebarMenuButton asChild>
            <a
              href={config.documentationUrl}
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
