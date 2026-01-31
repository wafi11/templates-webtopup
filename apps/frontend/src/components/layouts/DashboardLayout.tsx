import { useState } from "react";
import { SidebarDashboard } from "./SidebarDashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SidebarDashboard
        open={sidebarOpen}
        onOpenChange={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-8">{children}</main>
    </div>
  );
}
