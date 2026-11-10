import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store";
import Shell from "@/components/Shell";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = { title: "רבר הפקות · ניהול", description: "ניהול לידים, יומן, אירועים, הודעות וכספים", robots: { index: false } };

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <Shell>{children}</Shell>
      </StoreProvider>
    </AuthProvider>
  );
}
