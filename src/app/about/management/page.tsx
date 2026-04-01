// src/app/about/management/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { topManagement, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Top Management",
  description: `Meet the top management team of ${siteConfig.name}.`,
};

export default function ManagementPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>›</span><Link href="/about">About</Link><span>›</span><span>Top Management</span>
          </nav>
          <h1 className="page-hero-title">Top Management</h1>
          <p className="page-hero-sub">The experienced management team delivering RMCL's services across all branches and service centers.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {topManagement.map((member) => (
              <div key={member.id} className="card" style={{ padding: "28px", display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "rgba(139,26,26,0.15)", border: "1.5px solid var(--royal-gold)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "28px", color: "var(--royal-gold)", flexShrink: 0
                }}>
                  👤
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>{member.name}</div>
                  <div style={{ fontSize: "12px", color: "rgba(250,246,238,0.5)", lineHeight: "1.5" }}>{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
