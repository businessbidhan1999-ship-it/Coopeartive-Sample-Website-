// src/app/about/chairman/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { chairmanMessage, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Message from Chairman",
  description: `A message from ${chairmanMessage.name}, Chairman of ${siteConfig.name}.`,
};

export default function ChairmanPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>›</span><Link href="/about">About</Link><span>›</span><span>Chairman's Message</span>
          </nav>
          <h1 className="page-hero-title">Chairman's Message</h1>
          <p className="page-hero-sub">A word from our Chairman — {chairmanMessage.name}</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{
                width: "140px", height: "140px", borderRadius: "50%",
                background: "rgba(139,26,26,0.15)", border: "2px solid var(--royal-gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "56px", color: "var(--royal-gold)", margin: "0 auto 16px"
              }}>
                👤
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>{chairmanMessage.name}</div>
              <div style={{ fontSize: "12px", color: "var(--royal-gold)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{chairmanMessage.title}</div>
              <div style={{ fontSize: "12px", color: "rgba(250,246,238,0.4)", marginTop: "4px" }}>{siteConfig.name}</div>
            </div>

            <div>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)",
                borderRadius: "16px", padding: "36px"
              }}>
                <div style={{ fontSize: "48px", color: "var(--royal-gold)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: "16px", opacity: 0.4 }}>"</div>
                {chairmanMessage.message.split("\n\n").map((para, i) => (
                  <p key={i} style={{ fontSize: "15px", color: "rgba(250,246,238,0.7)", lineHeight: "1.85", marginBottom: "18px" }}>{para}</p>
                ))}
                <div style={{ borderTop: "1px solid var(--royal-border)", paddingTop: "20px", marginTop: "8px", fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--royal-gold)" }}>
                  — {chairmanMessage.name}, {chairmanMessage.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
