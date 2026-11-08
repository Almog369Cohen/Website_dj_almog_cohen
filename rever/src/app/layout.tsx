import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Shell from "@/components/Shell";

const heebo = Heebo({ subsets: ["hebrew", "latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-heebo" });

export const metadata: Metadata = { title: "רבר הפקות · ניהול", description: "ניהול לידים, יומן, הודעות וכספים" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#14171f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
