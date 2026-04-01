"use client";
// src/app/branches/page.tsx
import Link from "next/link";
import { branches, siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";

export default function BranchesPage() {
  const { t } = useLanguage();
  const bc = t.breadcrumb;
  const pg = t.pages;
  const br = t.branches;

  const hq = branches.filter((b) => b.isHQ);
  const others = branches.filter((b) => !b.isHQ);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{bc.home}</Link><span>›</span><span>{bc.branches}</span>
          </nav>
          <h1 className="page-hero-title">{pg.branchesTitle}</h1>
          <p className="page-hero-sub">
            {pg.branchesSub.replace("{count}", String(branches.length))}
          </p>
        </div>
      </div>

      {/* Map embed */}
      <div style={{ height: "380px", background: "var(--royal-deep)", borderBottom: "1px solid var(--royal-border)", overflow: "hidden" }}>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=85.25%2C27.55%2C85.42%2C27.82&layer=mapnik&marker=27.7523%2C85.3254"
          style={{ width: "100%", height: "100%", border: "none", filter: "invert(85%) hue-rotate(180deg)" }}
          title="RMCL branch locations"
          loading="lazy"
        />
      </div>

      <section className="section">
        <div className="container">
          {/* Head Office */}
          <div className="section-label">Head Office</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: "20px", marginBottom: "48px" }}>
            {hq.map((branch) => (
              <BranchCard key={branch.id} branch={branch} inChargeLabel={br.inCharge} hqBadge={br.hqBadge} />
            ))}
          </div>

          <div className="section-label">Branches & Service Centers</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: "20px" }}>
            {others.map((branch) => (
              <BranchCard key={branch.id} branch={branch} inChargeLabel={br.inCharge} hqBadge={br.hqBadge} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section style={{ background: "var(--royal-crimson)", padding: "48px 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "8px" }}>Can&apos;t find your nearest branch?</h3>
            <p style={{ fontSize: "14px", color: "rgba(250,246,238,0.75)" }}>Call us at {siteConfig.contact.phones[0]} — we&apos;re available Sun–Fri 9:30 AM to 5:00 PM.</p>
          </div>
          <Link href="/contact" className="btn btn-secondary">{t.footer.linkContact} →</Link>
        </div>
      </section>
    </>
  );
}

function BranchCard({ branch, inChargeLabel, hqBadge }: { branch: typeof branches[0]; inChargeLabel: string; hqBadge: string }) {
  return (
    <div style={{
      background: branch.isHQ ? "rgba(139,26,26,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${branch.isHQ ? "rgba(139,26,26,0.3)" : "var(--royal-border)"}`,
      borderRadius: "12px", padding: "28px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(250,246,238,0.35)" }}>{branch.type}</span>
          {branch.isHQ && <span style={{ marginLeft: "8px", background: "var(--royal-crimson)", color: "white", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>{hqBadge}</span>}
        </div>
        <span style={{ fontSize: "22px" }}>🏢</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600, marginBottom: "10px", lineHeight: "1.3" }}>{branch.name}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.55)" }}>👤 {inChargeLabel}: {branch.inCharge}</p>
        <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.55)" }}>📍 {branch.address}</p>
        <a href={`tel:${branch.phone.split(/[,/]/)[0].trim().replace(/[^0-9+]/g, "")}`} style={{ fontSize: "13px", color: "var(--royal-gold)", textDecoration: "none" }}>📞 {branch.phone.split(/[,/]/)[0].trim()}</a>
      </div>
    </div>
  );
}
