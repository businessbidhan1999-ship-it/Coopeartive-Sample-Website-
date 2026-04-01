// src/app/about/board/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { boardOfDirectors, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Board of Directors",
  description: `Meet the Board of Directors of ${siteConfig.name}.`,
};

export default function BoardPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>›</span><Link href="/about">About</Link><span>›</span><span>Board of Directors</span>
          </nav>
          <h1 className="page-hero-title">Board of Directors</h1>
          <p className="page-hero-sub">The elected board leading RMCL's governance and strategic direction.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {boardOfDirectors.map((member) => (
              <div key={member.id} className="card" style={{ padding: "32px", textAlign: "center" }}>
                <div style={{
                  width: "90px", height: "90px", borderRadius: "50%",
                  background: "rgba(139,26,26,0.15)", border: "2px solid var(--royal-gold)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "36px", color: "var(--royal-gold)",
                  margin: "0 auto 18px"
                }}>
                  👤
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600, marginBottom: "6px" }}>{member.name}</div>
                <div style={{ fontSize: "12px", color: "var(--royal-gold)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
