import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

function getRedirectUri(req: Request): string {
  if (process.env.SPOTIFY_REDIRECT_URI) return process.env.SPOTIFY_REDIRECT_URI;
  if (process.env.URL) return `${process.env.URL}/api/spotify/callback`;
  const url = new URL(req.url);
  const host = req.headers.get("host") || url.host;
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  return `${isLocal ? "http" : "https"}://${host}/api/spotify/callback`;
}

export async function GET(req: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET", {
      status: 500,
    });
  }

  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get("returnTo") || "/admin";

  const debug = searchParams.get("debug") === "1";

  const redirectUri = getRedirectUri(req);

  if (debug) {
    return NextResponse.json({
      redirectUri,
      netlifyUrlEnv: process.env.URL || null,
      spotifyRedirectUriEnv: process.env.SPOTIFY_REDIRECT_URI || null,
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
    });
  }
  const state = crypto.randomUUID();

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("show_dialog", "true");

  const res = NextResponse.redirect(authUrl.toString());
  res.cookies.set("compakt_spotify_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 10 * 60,
  });
  res.cookies.set("compakt_spotify_return_to", returnTo, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 10 * 60,
  });

  return res;
}

export async function POST(req: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET", {
      status: 500,
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new NextResponse("NOT_AUTHENTICATED", { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabase = createServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new NextResponse("SESSION_EXPIRED", { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const returnTo = typeof body?.returnTo === "string" ? body.returnTo : "/admin";

  const redirectUri = getRedirectUri(req);
  const state = crypto.randomUUID();

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("show_dialog", "true");

  const res = NextResponse.json({ url: authUrl.toString() });
  res.cookies.set("compakt_spotify_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 10 * 60,
  });
  res.cookies.set("compakt_spotify_return_to", returnTo, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 10 * 60,
  });
  res.cookies.set("compakt_spotify_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 10 * 60,
  });

  return res;
}
