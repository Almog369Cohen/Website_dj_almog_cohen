"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StaffGuard } from "@/components/auth/StaffGuard";
import { Sidebar } from "@/components/backoffice/Sidebar";
import { Header } from "@/components/backoffice/Header";
import { useViewerRole } from "@/components/backoffice/useViewerRole";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function BackofficeShell({ children }: { children: ReactNode }) {
  const viewer = useViewerRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!viewer) {
    return (
      <div className="min-h-dvh gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-dvh sticky top-0">
        <Sidebar role={viewer.role} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-64 lg:hidden">
            <Sidebar role={viewer.role} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          email={viewer.email}
          role={viewer.role}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function BackofficeLayout({ children }: { children: ReactNode }) {
  return (
    <StaffGuard>
      <QueryClientProvider client={queryClient}>
        <BackofficeShell>{children}</BackofficeShell>
      </QueryClientProvider>
    </StaffGuard>
  );
}
