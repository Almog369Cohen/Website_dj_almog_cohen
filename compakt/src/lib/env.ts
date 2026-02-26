import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

function validateClientEnv() {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
  if (!result.success) {
    console.warn("[env] Missing client env vars:", result.error.flatten().fieldErrors);
    return null;
  }

  if (process.env.NODE_ENV === "production" && !result.data.NEXT_PUBLIC_APP_URL) {
    console.warn("[env] NEXT_PUBLIC_APP_URL is not set. Public/admin links may be incorrect behind GCP/CDN.");
  }

  return result.data;
}

function validateServerEnv() {
  const result = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (!result.success) {
    console.error("[env] Missing server env vars:", result.error.flatten().fieldErrors);
    return null;
  }
  return result.data;
}

export const clientEnv = validateClientEnv();
export const serverEnv = typeof window === "undefined" ? validateServerEnv() : null;
