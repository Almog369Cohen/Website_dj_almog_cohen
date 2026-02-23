import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-sm text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
          style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
        >
          <span className="text-2xl font-bold text-white">404</span>
        </div>
        <h1 className="text-xl font-bold mb-2">העמוד לא נמצא</h1>
        <p className="text-sm text-secondary mb-6">נראה שהגעת לכתובת שלא קיימת</p>
        <Link href="/" className="btn-primary inline-block px-6 py-3">
          חזרה לעמוד הראשי
        </Link>
      </div>
    </div>
  );
}
