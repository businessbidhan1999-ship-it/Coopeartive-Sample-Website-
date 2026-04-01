// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "96px", fontWeight: 700, color: "var(--royal-gold)", lineHeight: 1, marginBottom: "16px", opacity: 0.3 }}>404</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, marginBottom: "14px" }}>Page Not Found</h1>
        <p style={{ fontSize: "15px", color: "rgba(250,246,238,0.55)", lineHeight: "1.7", marginBottom: "32px" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">Back to Home</Link>
          <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
