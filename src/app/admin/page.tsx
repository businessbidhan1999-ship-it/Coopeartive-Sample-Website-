// src/app/admin/page.tsx
import Link from "next/link";
import { newsItems, allProducts, branches } from "@/lib/data";

export default function AdminDashboard() {
  const stats = [
    { label: "News Items", value: newsItems.length, icon: "📰", href: "/admin/news", color: "#8B1A1A" },
    { label: "Products", value: allProducts.length, icon: "💳", href: "/admin/products", color: "#1a5c8b" },
    { label: "Branches", value: branches.length, icon: "📍", href: "/admin/branches", color: "#1a8b3a" },
    { label: "Pages Live", value: 11, icon: "🌐", href: "/", color: "#8b6e1a" },
  ];

  const quickActions = [
    { label: "Add News Article", href: "/admin/news", icon: "✏️" },
    { label: "Update Interest Rates", href: "/admin/rates", icon: "📈" },
    { label: "Add Branch", href: "/admin/branches", icon: "📍" },
    { label: "Manage Products", href: "/admin/products", icon: "💳" },
    { label: "Edit Team", href: "/admin/team", icon: "👥" },
    { label: "Site Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, marginBottom: "6px" }}>Dashboard</h1>
      <p style={{ fontSize: "14px", color: "rgba(250,246,238,0.4)", marginBottom: "32px" }}>Welcome back. Here&apos;s an overview of your RMCL website.</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "16px", marginBottom: "40px" }}>
        {stats.map(({ label, value, icon, href, color }) => (
          <Link key={label} href={href} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "12px", padding: "24px", textDecoration: "none", color: "inherit",
            display: "block", transition: "all 0.2s"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "24px" }}>{icon}</span>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: "#C9A84C", lineHeight: 1, marginBottom: "4px" }}>{value}</div>
            <div style={{ fontSize: "12px", color: "rgba(250,246,238,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "16px" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: "12px" }}>
          {quickActions.map(({ label, href, icon }) => (
            <Link key={label} href={href} style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(201,168,76,0.12)",
              borderRadius: "10px", padding: "16px 20px",
              display: "flex", alignItems: "center", gap: "12px",
              textDecoration: "none", color: "rgba(250,246,238,0.75)",
              fontSize: "13px", fontWeight: 500, transition: "all 0.2s"
            }}>
              <span style={{ fontSize: "18px" }}>{icon}</span>{label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent news */}
      <div>
        <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "16px" }}>Recent News Items</h2>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "12px", overflow: "hidden" }}>
          {newsItems.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: "16px", padding: "14px 20px",
              borderBottom: i < newsItems.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none"
            }}>
              <span style={{ fontSize: "20px" }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{item.title}</div>
                <div style={{ fontSize: "11px", color: "rgba(250,246,238,0.35)" }}>{item.date} · {item.category}</div>
              </div>
              <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "6px", background: item.featured ? "rgba(139,26,26,0.2)" : "rgba(255,255,255,0.04)", color: item.featured ? "#e07070" : "rgba(250,246,238,0.35)", border: `1px solid ${item.featured ? "rgba(139,26,26,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                {item.featured ? "Featured" : "Published"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
