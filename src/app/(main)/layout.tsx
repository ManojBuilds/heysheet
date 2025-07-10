import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, Sidebar as UISidebar, SidebarContent } from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <Topbar />
        <div className="flex-1 flex">
          <UISidebar>
            <SidebarContent className="bg-black/30 backdrop-blur-lg">
              <Logo/>
              <Sidebar />
            </SidebarContent>
          </UISidebar>
          <main className="overflow-y-auto p-6 max-h-[calc(100svh-4rem)] flex-1">
            {children}
          </main>

          {/* <Footer /> */}
        </div>
      </div>
    </SidebarProvider>
  );
}
