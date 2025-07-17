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
      <div className="flex flex-col h-screen w-full bg-zinc-50 dark:bg-zinc-950">
        <Topbar />
        <div className="flex-1 flex">
          <UISidebar>
            <SidebarContent className="backdrop-blur-lg bg-zinc-50/80 dark:bg-zinc-950/80 sm:pt-4">
              <Logo className="sm:invisible px-4 pt-4" />
              <Sidebar />
            </SidebarContent>
          </UISidebar>
          <main className="max-h-[calc(100svh-4rem)] flex-1 p-2 sm:pr-0 bg-secondary">
            <div className="bg-background overflow-y-auto w-full h-full rounded-l-2xl ring ring-gray-200 dark:ring-border p-4">
              {children}
            </div>
          </main>

          {/* <Footer /> */}
        </div>
      </div>
    </SidebarProvider>
  );
}
