"use client";
// src/app/products/page.tsx
import Link from "next/link";
import { loanProducts, depositProducts, microfinanceProducts, interestRateTable } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";

export default function ProductsPage() {
  const { t } = useLanguage();
  const bc = t.breadcrumb;
  const pg = t.pages;
  const nav = t.nav;

  const categories = [
    { key: "loans", label: nav.loans, icon: "💳", products: loanProducts, base: "/products/loans" },
    { key: "deposits", label: nav.deposits, icon: "🏦", products: depositProducts, base: "/products/deposits" },
    { key: "microfinance", label: nav.microfinance, icon: "🤝", products: microfinanceProducts, base: "/products/microfinance" },
  ];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{bc.home}</Link><span>›</span><span>{bc.products}</span>
          </nav>
          <h1 className="page-hero-title">{pg.productsTitle}</h1>
          <p className="page-hero-sub">{pg.productsSub}</p>
        </div>
      </div>

      {categories.map(({ key, label, icon, products, base }) => (
        <section key={key} className="section" style={{ borderBottom: "1px solid var(--royal-border)" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" }}>
              <span style={{ fontSize: "32px" }}>{icon}</span>
              <div>
                <div className="section-label">{label}</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700 }}>{label}</h2>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "20px" }}>
              {products.map((p) => (
                <Link key={p.id} href={`${base}/${p.slug}`} className="card" style={{ padding: "28px", display: "block", textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <span style={{ fontSize: "32px" }}>{p.emoji}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: "var(--royal-gold)", padding: "4px 10px", borderRadius: "6px" }}>{p.rate}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}>{p.name}</h3>
                  <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.55)", lineHeight: "1.6", marginBottom: "16px" }}>{p.description.slice(0, 110)}…</p>
                  <span style={{ color: "var(--royal-gold)", fontSize: "13px" }}>View Details →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Interest Rate Table */}
      <section className="section" id="rates" style={{ background: "var(--royal-deep)" }}>
        <div className="container">
          <div className="section-label">{t.calc.currentRates}</div>
          <h2 className="section-title" style={{ marginBottom: "40px" }}>{t.calc.currentRates}</h2>
          <div className="page-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {[
              { title: t.calc.loansHead, data: interestRateTable.loans },
              { title: t.calc.depositsHead, data: interestRateTable.deposits },
            ].map(({ title, data }) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--royal-border)", fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600 }}>{title}</div>
                {data.map((row, i) => (
                  <div key={row.product} style={{
                    display: "flex", justifyContent: "space-between", padding: "12px 20px",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    fontSize: "13px", color: "rgba(250,246,238,0.7)"
                  }}>
                    <span>{row.product}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--royal-gold)", fontWeight: 600 }}>
                      {row.minRate === row.maxRate ? `${row.minRate}%` : `${row.minRate}–${row.maxRate}%`} {row.unit}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p style={{ marginTop: "20px", fontSize: "12px", color: "rgba(250,246,238,0.35)" }}>
            {t.calc.disclaimer}
          </p>
        </div>
      </section>
    </>
  );
}
