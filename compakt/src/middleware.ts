import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Auth enforcement is handled client-side via guards (Supabase session in localStorage).
  // Upgrade path: install @supabase/ssr for cookie-based session → enforce here.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/backoffice/:path*"],
};
