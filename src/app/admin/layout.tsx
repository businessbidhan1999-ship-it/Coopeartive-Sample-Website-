"use client";
// src/app/admin/layout.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/news", label: "News & Notices", icon: "📰" },
  { href: "/admin/products", label: "Products", icon: "💳" },
  { href: "/admin/rates", label: "Interest Rates", icon: "📈" },
  { href: "/admin/branches", label: "Branches", icon: "📍" },
  { href: "/admin/team", label: "Team Members", icon: "👥" },
  { href: "/admin/submissions", label: "Submissions", icon: "📬" },
  { href: "/admin/settings", label: "Site Settings", icon: "⚙️" },
  { href: "/admin/credentials", label: "Credentials", icon: "🔐" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sideOpen, setSideOpen] = useState(true);
  const [session, setSession] = useState<{ username: string; role: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setSession({ username: data.username, role: data.role });
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  // Don't render the shell on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080504" }}>
      {/* Sidebar */}
      <aside style={{
        width: sideOpen ? "240px" : "64px",
        background: "#0F0A04",
        borderRight: "1px solid rgba(201,168,76,0.15)",
        display: "flex", flexDirection: "column",
        transition: "width 0.25s",
        flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden"
      }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(201,168,76,0.12)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "#8B1A1A", border: "1px solid #C9A84C", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: 700, color: "#C9A84C", flexShrink: 0 }}>R</div>
          {sideOpen && <div style={{ fontSize: "13px", fontWeight: 600, color: "#FAF6EE", whiteSpace: "nowrap" }}>RMCL Admin</div>}
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map(({ href, label, icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "8px", marginBottom: "2px",
                background: active ? "rgba(139,26,26,0.3)" : "transparent",
                border: `1px solid ${active ? "rgba(139,26,26,0.4)" : "transparent"}`,
                color: active ? "#FAF6EE" : "rgba(250,246,238,0.5)",
                textDecoration: "none", fontSize: "13px", fontWeight: active ? 500 : 400,
                transition: "all 0.2s", whiteSpace: "nowrap"
              }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
                {sideOpen && label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(201,168,76,0.1)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <Link href="/" target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "8px",
            color: "rgba(250,246,238,0.4)", textDecoration: "none", fontSize: "13px", whiteSpace: "nowrap"
          }}>
            <span>🌐</span>{sideOpen && "View Website"}
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px",
              color: "rgba(248,113,113,0.7)", background: "none", border: "none",
              cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap", width: "100%", textAlign: "left"
            }}
          >
            <span>🚪</span>{sideOpen && (loggingOut ? "Signing out…" : "Sign Out")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* Top bar */}
        <header style={{
          height: "60px", background: "#0F0A04",
          borderBottom: "1px solid rgba(201,168,76,0.12)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", position: "sticky", top: 0, zIndex: 10
        }}>
          <button onClick={() => setSideOpen(!sideOpen)} style={{ background: "none", border: "none", color: "rgba(250,246,238,0.5)", cursor: "pointer", fontSize: "18px", padding: "4px" }} aria-label="Toggle sidebar">
            ☰
          </button>
          {session && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "rgba(250,246,238,0.4)" }}>
                {session.username}
                <span style={{ marginLeft: "6px", padding: "2px 6px", background: "rgba(201,168,76,0.15)", borderRadius: "4px", fontSize: "10px", color: "#C9A84C", textTransform: "uppercase" }}>
                  {session.role}
                </span>
              </span>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(139,26,26,0.3)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#C9A84C", fontWeight: 600 }}>
                {session.username[0].toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "32px 24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
