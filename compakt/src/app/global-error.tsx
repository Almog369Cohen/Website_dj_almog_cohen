"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ background: "#0a0a0f", color: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "1rem" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>שגיאה בטעינת האפליקציה</h2>
            <p style={{ fontSize: "0.875rem", opacity: 0.6, marginBottom: "1.5rem" }}>
              {error.message || "אירעה שגיאה לא צפויה"}
            </p>
            <button
              onClick={reset}
              style={{
                background: "linear-gradient(135deg, #059cc0, #03b28c)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              נסה שוב
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
