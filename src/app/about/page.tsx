"use client";
// src/app/about/page.tsx
import Link from "next/link";
import { aboutData, siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.about;
  const bc = t.breadcrumb;
  const pg = t.pages;
  const nav = t.nav;

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{bc.home}</Link><span>›</span><span>{bc.about}</span>
          </nav>
          <h1 className="page-hero-title">{pg.aboutTitle}</h1>
          <p className="page-hero-sub">
            {t.hero.established} {siteConfig.established} — {siteConfig.registrationAct}
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="section">
        <div className="container page-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
          <div>
            <div className="section-label">{nav.introduction}</div>
            <h2 className="section-title" style={{ marginBottom: "24px" }}>{a.title} {siteConfig.established}</h2>
            {aboutData.introduction.split("\n\n").map((p, i) => (
              <p key={i} style={{ fontSize: "15px", color: "rgba(250,246,238,0.65)", lineHeight: "1.8", marginBottom: "16px" }}>{p}</p>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { label: a.missionLabel, text: aboutData.mission, icon: "🎯" },
              { label: a.visionLabel, text: aboutData.vision, icon: "👁" },
              { label: a.goalLabel, text: aboutData.goal, icon: "⚖️" },
            ].map(({ label, text, icon }) => (
              <div key={label} className="card" style={{ padding: "24px" }}>
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
                <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "8px" }}>{label}</div>
                <p style={{ fontSize: "14px", color: "rgba(250,246,238,0.65)", lineHeight: "1.65" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section" style={{ background: "var(--royal-deep)", borderTop: "1px solid var(--royal-border)" }}>
        <div className="container">
          <div className="section-label">{a.coreObjectives}</div>
          <h2 className="section-title" style={{ marginBottom: "40px" }}>{a.coreObjectives}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "14px" }}>
            {aboutData.objectives.map((obj, i) => (
              <div key={obj} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)", borderRadius: "10px" }}>
                <span style={{ color: "var(--royal-gold)", fontWeight: 700, flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: "12px" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: "14px", color: "rgba(250,246,238,0.7)" }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="section-sm">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "16px" }}>
            {[
              { href: "/about/chairman", label: nav.chairmanMsg, icon: "✉️" },
              { href: "/about/board", label: nav.board, icon: "👥" },
              { href: "/about/management", label: nav.management, icon: "🏢" },
              { href: "/branches", label: nav.ourBranches, icon: "📍" },
            ].map(({ href, label, icon }) => (
              <Link key={href} href={href} className="card" style={{ padding: "24px", display: "flex", gap: "14px", alignItems: "center", textDecoration: "none" }}>
                <span style={{ fontSize: "26px" }}>{icon}</span>
                <span style={{ fontSize: "14px", fontWeight: 500 }}>{label} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
