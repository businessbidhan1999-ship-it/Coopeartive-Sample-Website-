// src/app/products/[category]/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allProducts } from "@/lib/data";

interface Props { params: { category: string; slug: string } }

export async function generateStaticParams() {
  return allProducts.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = allProducts.find((p) => p.slug === params.slug);
  if (!product) return { title: "Product Not Found" };
  return { title: product.name, description: product.description };
}

export default function ProductDetailPage({ params }: Props) {
  const product = allProducts.find((p) => p.slug === params.slug);
  if (!product) notFound();

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/products">Products</Link><span>›</span>
            <span>{product.name}</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
            <span style={{ fontSize: "48px" }}>{product.emoji}</span>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "8px" }}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </div>
              <h1 className="page-hero-title" style={{ marginBottom: 0 }}>{product.name}</h1>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "var(--royal-gold)", fontSize: "14px", fontWeight: 600, padding: "6px 16px", borderRadius: "8px" }}>
              {product.rate}
            </span>
            <Link href="/apply" className="btn btn-primary">Apply Now →</Link>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "60px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 600, marginBottom: "16px" }}>Overview</h2>
            <p style={{ fontSize: "15px", color: "rgba(250,246,238,0.7)", lineHeight: "1.8", marginBottom: "40px" }}>{product.description}</p>

            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "16px" }}>Key Features</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
              {product.features.map((f) => (
                <li key={f} style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "14px", color: "rgba(250,246,238,0.7)" }}>
                  <span style={{ color: "var(--royal-gold)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                </li>
              ))}
            </ul>

            {"interestRates" in product && Array.isArray((product as any).interestRates) && (
              <>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "16px" }}>Interest Rate Schedule</h3>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)", borderRadius: "10px", overflow: "hidden", marginBottom: "40px" }}>
                  {(product as any).interestRates.map((r: any, i: number) => (
                    <div key={r.period} style={{
                      display: "flex", justifyContent: "space-between", padding: "14px 20px",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      fontSize: "14px", color: "rgba(250,246,238,0.7)"
                    }}>
                      <span>{r.period}</span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--royal-gold)", fontWeight: 700 }}>{r.rate} p.a.</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Requirements */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)", borderRadius: "12px", padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600, marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--royal-border)" }}>
                Documents Required
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {product.requirements.map((r) => (
                  <li key={r} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", color: "rgba(250,246,238,0.65)" }}>
                    <span style={{ color: "var(--royal-gold)", flexShrink: 0 }}>📄</span>{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Facilities */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)", borderRadius: "12px", padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600, marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--royal-border)" }}>
                Additional Facilities
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {product.facilities.map((f) => (
                  <span key={f} style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "var(--royal-gold)", fontSize: "12px", padding: "4px 12px", borderRadius: "6px" }}>{f}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: "rgba(139,26,26,0.1)", border: "1px solid rgba(139,26,26,0.2)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "rgba(250,246,238,0.7)", marginBottom: "16px", lineHeight: "1.6" }}>
                Ready to apply for {product.name}? Our team will contact you within 1–2 working days.
              </p>
              <Link href="/apply" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Apply Now →
              </Link>
              <Link href="/contact" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}>
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
