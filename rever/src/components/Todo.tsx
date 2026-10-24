/** Bright green marker for details that are not verified yet. Remove once the client confirms them. */
export function Todo({ children, dir }: { children: React.ReactNode; dir?: "ltr" | "rtl" }) {
  return (
    <mark dir={dir} className="rounded-md bg-[#22c55e] px-2 py-0.5 font-bold text-[#04210f] [box-decoration-break:clone]" title="לא מאומת, להשלים">
      {children}
    </mark>
  );
}
