"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function buildSelector(el: Element) {
  const tag = el.tagName.toLowerCase();
  const id = (el as HTMLElement).id;
  if (id) return `#${CSS.escape(id)}`;

  const classList = Array.from((el as HTMLElement).classList || []).filter(Boolean);
  const classPart = classList.length ? "." + classList.slice(0, 3).map((c) => CSS.escape(c)).join(".") : "";

  const parent = el.parentElement;
  if (!parent) return `${tag}${classPart}`;

  const siblings = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
  if (siblings.length <= 1) return `${tag}${classPart}`;

  const index = siblings.indexOf(el) + 1;
  return `${tag}${classPart}:nth-of-type(${index})`;
}

export function ElementInspectorMode() {
  const searchParams = useSearchParams();
  const enabled = useMemo(() => {
    const v = searchParams?.get("inspect");
    return v === "1" || v === "true" || v === "yes";
  }, [searchParams]);

  const [rect, setRect] = useState<DOMRect | null>(null);
  const [label, setLabel] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [toast, setToast] = useState<string>("");
  const [dismissed, setDismissed] = useState(false);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (!enabled) return;
    if (dismissed) return;

    const getTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      if (target.closest("[data-inspector-ui='true']")) return null;
      return target;
    };

    const onMove = (e: MouseEvent) => {
      const t = getTarget(e.target);
      if (!t) {
        setRect(null);
        setLabel("");
        return;
      }
      const r = t.getBoundingClientRect();
      setRect(r);
      const selector = buildSelector(t);
      setLabel(selector);
    };

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.top = "-1000px";
          ta.style.left = "-1000px";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          return ok;
        } catch {
          return false;
        }
      }
    };

    const onClick = async (e: MouseEvent) => {
      const t = getTarget(e.target);
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();

      const selector = buildSelector(t);
      setSelected(selector);
      const ok = await copyToClipboard(selector);
      setToast(ok ? `Copied: ${selector}` : `Copy failed: ${selector}`);
      window.setTimeout(() => setToast(""), 1400);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setRect(null);
        setLabel("");
        setDismissed(true);
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled, dismissed]);

  useEffect(() => {
    if (enabled) {
      setDismissed(false);
    }
  }, [enabled]);

  if (!enabled) return null;
  if (dismissed) return null;

  const copySelected = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected);
      setToast(`Copied: ${selected}`);
      window.setTimeout(() => setToast(""), 1400);
    } catch {
      setToast(`Copy failed: ${selected}`);
      window.setTimeout(() => setToast(""), 1400);
    }
  };

  const closeInspector = () => {
    setDismissed(true);
  };

  const sendElement = async () => {
    if (!selected) return;
    const trimmed = note.trim();
    const payload = trimmed
      ? `@[dom-element:${selected}] ${trimmed}`
      : `@[dom-element:${selected}]`;
    try {
      await navigator.clipboard.writeText(payload);
      setToast("Copied. Paste it into the chat.");
      window.setTimeout(() => setToast(""), 1400);
    } catch {
      setToast("Copy failed. Try Copy button, then paste.");
      window.setTimeout(() => setToast(""), 1400);
    }
  };

  return (
    <>
      <div
        data-inspector-ui="true"
        className="fixed bottom-4 right-4 z-[9999] w-[min(420px,calc(100vw-32px))] rounded-2xl border border-border bg-background/85 p-4 text-sm text-foreground shadow-xl backdrop-blur"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold">מצב סימון אלמנטים</div>
            <div className="mt-1 text-xs text-muted-foreground">לחיצה על אלמנט תסמן אותו ותעתיק Selector.</div>
          </div>
          <button
            type="button"
            onClick={closeInspector}
            className="shrink-0 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-bold text-foreground hover:bg-background"
          >
            סגירה
          </button>
        </div>

        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs font-bold text-foreground-secondary">Hover</div>
            <div className="mt-1 rounded-xl border border-border bg-background/60 px-3 py-2 font-mono text-xs text-foreground">
              {label || "—"}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-bold text-foreground-secondary">Selected</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copySelected}
                  disabled={!selected}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-bold text-foreground disabled:opacity-50"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={sendElement}
                  disabled={!selected}
                  className="rounded-full bg-foreground px-3 py-1 text-xs font-bold text-background disabled:opacity-50"
                >
                  Send element
                </button>
              </div>
            </div>
            <div className="mt-1 rounded-xl border border-border bg-background/60 px-3 py-2 font-mono text-xs text-foreground">
              {selected || "—"}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-foreground-secondary">Note</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="כתוב פה מה לתקן ואז לחץ Send element"
              className="mt-1 w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Send element מעתיק הודעה מוכנה ללוח. פשוט תדביק אותה פה בצ׳אט.
          </div>
        </div>
      </div>

      {rect ? (
        <div
          data-inspector-ui="true"
          className="pointer-events-none fixed z-[9998] rounded-md border-2 border-[#03b28c] bg-[#03b28c]/10"
          style={{
            left: Math.max(0, rect.left),
            top: Math.max(0, rect.top),
            width: Math.max(0, rect.width),
            height: Math.max(0, rect.height),
          }}
        />
      ) : null}

      {label ? (
        <div
          data-inspector-ui="true"
          className="fixed bottom-4 left-4 z-[9999] max-w-[calc(100vw-24px)] rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground backdrop-blur"
        >
          {label}
        </div>
      ) : null}

      {toast ? (
        <div data-inspector-ui="true" className="fixed top-4 left-4 z-[9999] rounded-xl border border-border bg-background/85 px-3 py-2 text-xs font-bold text-foreground shadow-lg backdrop-blur">
          {toast}
        </div>
      ) : null}
    </>
  );
}
