/**
 * Run SQL migration against Supabase using the Management API.
 * Usage: node scripts/migrate.mjs
 *
 * Falls back to splitting SQL and running via service-role REST if Management API unavailable.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  console.error("Run: source .env.local && node scripts/migrate.mjs");
  process.exit(1);
}

const sqlPath = resolve(__dirname, "../supabase/migrations/002_multi_tenant.sql");
const sql = readFileSync(sqlPath, "utf-8");

// Split SQL into individual statements (handling $$ blocks)
function splitStatements(sql) {
  const statements = [];
  let current = "";
  let inDollarQuote = false;

  const lines = sql.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("--") && !inDollarQuote) continue;
    if (trimmed === "") {
      if (current.trim()) current += "\n";
      continue;
    }

    if (trimmed.includes("$$")) {
      const count = (trimmed.match(/\$\$/g) || []).length;
      if (count % 2 === 1) inDollarQuote = !inDollarQuote;
    }

    current += line + "\n";

    if (!inDollarQuote && trimmed.endsWith(";")) {
      const stmt = current.trim();
      if (stmt && stmt !== ";") statements.push(stmt);
      current = "";
    }
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

async function runSQL(statement) {
  // Use the Supabase pg endpoint (available with service role key)
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: statement }),
  });
  return resp;
}

async function main() {
  console.log("🔄 Running migration...\n");

  // First, create exec_sql helper function if it doesn't exist
  const helperSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $fn$
    BEGIN
      EXECUTE query;
    END;
    $fn$;
  `;

  // Try to create the helper via a direct approach
  // We'll use the Supabase SQL query endpoint
  const queryEndpoint = `${SUPABASE_URL}/pg/query`;

  // Try the pg query endpoint first (works on newer Supabase instances)
  let usePgEndpoint = false;
  try {
    const testResp = await fetch(queryEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: "SELECT 1 as test" }),
    });
    if (testResp.ok) {
      usePgEndpoint = true;
      console.log("✅ Using Supabase pg/query endpoint\n");
    }
  } catch { }

  if (usePgEndpoint) {
    // Run the whole migration at once
    const resp = await fetch(queryEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });

    if (resp.ok) {
      console.log("✅ Migration completed successfully!");
      return;
    } else {
      const err = await resp.text();
      console.log(`⚠️  pg/query failed: ${resp.status} — trying statement-by-statement...\n`);
      console.log(err.slice(0, 500));
    }
  }

  // Fallback: create exec_sql function first, then use it
  console.log("📋 Trying exec_sql RPC approach...\n");

  // Try to create exec_sql via pg endpoint
  if (usePgEndpoint) {
    await fetch(queryEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: helperSQL }),
    });
  }

  const statements = splitStatements(sql);
  console.log(`Found ${statements.length} statements to execute\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.slice(0, 80).replace(/\n/g, " ");

    const resp = await runSQL(stmt);
    if (resp.ok) {
      success++;
      console.log(`  ✅ [${i + 1}/${statements.length}] ${preview}...`);
    } else {
      const errText = await resp.text();
      // Ignore "already exists" errors
      if (errText.includes("already exists") || errText.includes("duplicate")) {
        success++;
        console.log(`  ⏭️  [${i + 1}/${statements.length}] Already exists: ${preview}...`);
      } else {
        failed++;
        console.log(`  ❌ [${i + 1}/${statements.length}] ${preview}...`);
        console.log(`     Error: ${errText.slice(0, 200)}`);
      }
    }
  }

  console.log(`\n📊 Results: ${success} succeeded, ${failed} failed out of ${statements.length} statements`);

  if (failed > 0) {
    console.log("\n⚠️  Some statements failed. You may need to run the migration SQL manually.");
    console.log("   Copy the SQL from: supabase/migrations/001_multi_tenant.sql");
    console.log("   Paste it in: Supabase Dashboard → SQL Editor → New query → Run");
    console.log(`   Dashboard: https://supabase.com/dashboard/project/rgfajvnkrszwksiidspm/sql`);
  }
}

main().catch(console.error);
