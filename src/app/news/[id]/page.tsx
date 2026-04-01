// src/app/news/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { newsItems } from "@/lib/data";
import { formatDate } from "@/lib/utils";

interface Props { params: { id: string } }

export async function generateStaticParams() {
  return newsItems.map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = newsItems.find((n) => n.id === params.id);
  if (!item) return { title: "Not Found" };
  return { title: item.title, description: item.excerpt };
}

export default function NewsDetailPage({ params }: Props) {
  const item = newsItems.find((n) => n.id === params.id);
  if (!item) notFound();
  const others = newsItems.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>›</span><Link href="/news">News</Link><span>›</span><span>{item.title}</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "60px", alignItems: "start" }}>
          <article>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <span className="badge badge-gold">{item.category}</span>
              <time style={{ fontSize: "12px", color: "rgba(250,246,238,0.4)", display: "flex", alignItems: "center" }}>{formatDate(item.date)}</time>
            </div>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>{item.emoji}</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, lineHeight: "1.2", marginBottom: "24px" }}>{item.title}</h1>
            <p style={{ fontSize: "17px", color: "rgba(250,246,238,0.55)", lineHeight: "1.7", marginBottom: "32px", fontStyle: "italic", borderLeft: "3px solid var(--royal-gold)", paddingLeft: "16px" }}>{item.excerpt}</p>
            <div style={{ borderTop: "1px solid var(--royal-border)", paddingTop: "32px" }}>
              {item.content.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontSize: "15px", color: "rgba(250,246,238,0.7)", lineHeight: "1.85", marginBottom: "20px" }}>{para}</p>
              ))}
            </div>
            <Link href="/news" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--royal-gold)", fontSize: "14px", marginTop: "20px" }}>
              ← Back to All News
            </Link>
          </article>

          <aside>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600, marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--royal-border)" }}>
              More Updates
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {others.map((n) => (
                <Link key={n.id} href={`/news/${n.id}`} style={{
                  display: "flex", gap: "14px", textDecoration: "none", color: "inherit",
                  padding: "16px", background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--royal-border)", borderRadius: "10px"
                }}>
                  <span style={{ fontSize: "24px", flexShrink: 0 }}>{n.emoji}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px", lineHeight: "1.35" }}>{n.title}</div>
                    <div style={{ fontSize: "11px", color: "rgba(250,246,238,0.35)" }}>{formatDate(n.date)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
