"use client";
// src/app/news/page.tsx
import Link from "next/link";
import { newsItems } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n-context";

export default function NewsPage() {
  const { t } = useLanguage();
  const n = t.news;
  const bc = t.breadcrumb;
  const pg = t.pages;

  const featured = newsItems.find((item) => item.featured);
  const rest = newsItems.filter((item) => item !== featured);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{bc.home}</Link><span>›</span><span>{bc.news}</span>
          </nav>
          <h1 className="page-hero-title">{pg.newsTitle}</h1>
          <p className="page-hero-sub">{pg.newsSub}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {featured && (
            <Link href={`/news/${featured.id}`} style={{
              display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px",
              background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)",
              borderRadius: "16px", padding: "40px", marginBottom: "40px",
              textDecoration: "none", color: "inherit", alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px", background: "rgba(201,168,76,0.06)", borderRadius: "12px", height: "160px" }}>
                {featured.emoji}
              </div>
              <div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                  <span className="badge badge-crimson">{n.featured}</span>
                  <span className="badge badge-gold">{featured.category}</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, marginBottom: "12px", lineHeight: "1.3" }}>{featured.title}</h2>
                <p style={{ fontSize: "14px", color: "rgba(250,246,238,0.6)", lineHeight: "1.7", marginBottom: "16px" }}>{featured.excerpt}</p>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <time style={{ fontSize: "12px", color: "rgba(250,246,238,0.35)" }}>{formatDate(featured.date)}</time>
                  <span style={{ color: "var(--royal-gold)" }}>{n.readMore}</span>
                </div>
              </div>
            </Link>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "20px" }}>
            {rest.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "28px" }}>{item.emoji}</span>
                  <span className="badge badge-gold" style={{ fontSize: "10px" }}>{item.category}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600, marginBottom: "10px", lineHeight: "1.35" }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.55)", lineHeight: "1.6", flex: 1, marginBottom: "20px" }}>{item.excerpt}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <time style={{ fontSize: "11px", color: "rgba(250,246,238,0.35)" }}>{formatDate(item.date)}</time>
                  <span style={{ color: "var(--royal-gold)" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
