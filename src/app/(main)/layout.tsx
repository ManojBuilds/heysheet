import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 flex">
        <div className="w-[280px]">
          <Sidebar />
        </div>
        <main className="w-full left-[280px] overflow-y-auto p-6 max-h-[calc(100svh-4rem)] flex-1">
          {children}
        </main>

        {/* <Footer /> */}
      </div>
    </div>
  );
}
