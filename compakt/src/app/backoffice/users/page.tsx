"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Search, Copy, ChevronLeft, ChevronRight, Eye, Loader2, UserPlus, X, EyeOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/backoffice/PageShell";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface UserRow {
  id: string;
  fullName: string;
  email: string;
  role: string;
  lastSignIn: string | null;
  createdAt: string;
}

interface UsersResponse {
  users: UserRow[];
  total: number;
  page: number;
  limit: number;
}

const ROLE_LABELS: Record<string, string> = {
  owner: "בעלים",
  admin: "מנהל",
  support: "תמיכה",
  accountant: "רו״ח",
  assistant: "עוזר",
  dj: "DJ",
};

const ROLE_COLORS: Record<string, string> = {
  owner: "var(--accent-gold)",
  admin: "var(--accent-primary)",
  support: "var(--accent-secondary)",
  dj: "var(--text-muted)",
};

async function fetchUsers(page: number, query: string): Promise<UsersResponse> {
  if (!supabase) return { users: [], total: 0, page: 1, limit: 20 };

  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) return { users: [], total: 0, page: 1, limit: 20 };

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (query) params.set("query", query);

  const res = await fetch(`/api/backoffice/users?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return { users: [], total: 0, page: 1, limit: 20 };
  return res.json();
}

function copyEmail(email: string) {
  void navigator.clipboard.writeText(email);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "לא התחבר";
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface CreateUserForm {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "dj", label: "DJ" },
  { value: "assistant", label: "עוזר" },
  { value: "support", label: "תמיכה" },
  { value: "accountant", label: "רו\"ח" },
  { value: "admin", label: "מנהל" },
  { value: "owner", label: "בעלים" },
];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    email: "",
    password: "",
    fullName: "",
    role: "dj",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (form: CreateUserForm) => {
      if (!supabase) throw new Error("Supabase not configured");
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/backoffice/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create user");
      return data;
    },
    onSuccess: () => {
      setShowCreate(false);
      setCreateForm({ email: "", password: "", fullName: "", role: "dj" });
      setCreateError(null);
      queryClient.invalidateQueries({ queryKey: ["backoffice-users"] });
    },
    onError: (err: Error) => {
      setCreateError(err.message);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["backoffice-users", page, query],
    queryFn: () => fetchUsers(page, query),
  });

  const totalPages = Math.ceil((data?.total ?? 0) / 20);

  const columns = useMemo<ColumnDef<UserRow>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "שם",
        cell: ({ row }) => (
          <div className="min-w-[120px]">
            <p className="font-medium text-sm">{row.original.fullName || "—"}</p>
            <p className="text-xs text-muted truncate max-w-[200px]">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "תפקיד",
        cell: ({ getValue }) => {
          const role = getValue<string>();
          return (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                color: ROLE_COLORS[role] ?? "var(--text-muted)",
                background: `color-mix(in srgb, ${ROLE_COLORS[role] ?? "var(--text-muted)"} 12%, transparent)`,
              }}
            >
              {ROLE_LABELS[role] ?? role}
            </span>
          );
        },
      },
      {
        accessorKey: "lastSignIn",
        header: "התחברות אחרונה",
        cell: ({ getValue }) => (
          <span className="text-xs text-secondary">
            {formatDateTime(getValue<string | null>())}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "נוצר",
        cell: ({ getValue }) => (
          <span className="text-xs text-secondary">{formatDate(getValue<string>())}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => copyEmail(row.original.email)}
              className="p-1.5 rounded text-muted hover:text-foreground transition-colors"
              title="העתק אימייל"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <Link
              href={`/backoffice/users/${row.original.id}`}
              className="p-1.5 rounded text-muted hover:text-brand-blue transition-colors"
              title="צפייה"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageShell
      title="משתמשים"
      description={data ? `${data.total} משתמשים` : "טוען..."}
    >
      {/* Top bar: Search + Create */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQuery(searchInput);
                setPage(1);
              }
            }}
            placeholder="חיפוש לפי שם..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateError(null); }}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          משתמש חדש
        </button>
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="glass-card p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 left-4 text-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">יצירת משתמש חדש</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCreateError(null);
                createMutation.mutate(createForm);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs text-secondary mb-1">שם מלא</label>
                <input
                  type="text"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-transparent border border-glass text-sm focus:outline-none focus:border-brand-blue transition-colors"
                  placeholder="שם מלא"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">אימייל *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-transparent border border-glass text-sm focus:outline-none focus:border-brand-blue transition-colors"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">סיסמה *</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    minLength={6}
                    value={createForm.password}
                    onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-transparent border border-glass text-sm focus:outline-none focus:border-brand-blue transition-colors"
                    placeholder="לפחות 6 תווים"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">תפקיד</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-transparent border border-glass text-sm focus:outline-none focus:border-brand-blue transition-colors"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {createError && (
                <p className="text-sm" style={{ color: "var(--accent-danger)" }}>{createError}</p>
              )}

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                צור משתמש
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
          </div>
        ) : (data?.users.length ?? 0) === 0 ? (
          <div className="text-center py-16 text-sm text-muted">
            לא נמצאו משתמשים
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-glass">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-right text-xs font-medium text-muted"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-glass/50 hover:bg-[var(--bg-surface-hover)] transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg text-muted hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm text-secondary">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg text-muted hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </PageShell>
  );
}
