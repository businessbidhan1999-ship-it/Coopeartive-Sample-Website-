"use client";
// src/components/sections/ProductsSection.tsx
import { useState, useRef } from "react";
import Link from "next/link";
import { loanProducts, depositProducts, microfinanceProducts } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";
import styles from "./ProductsSection.module.css";

/** Trim at last whole word before limit */
function truncateWords(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

export function ProductsSection() {
  const { t } = useLanguage();
  const p = t.products;

  const tabs = [
    { key: "loans", label: p.tabLoans, products: loanProducts, base: "/products/loans" },
    { key: "deposits", label: p.tabDeposits, products: depositProducts, base: "/products/deposits" },
    { key: "microfinance", label: p.tabMicrofinance, products: microfinanceProducts, base: "/products/microfinance" },
  ];

  const [active, setActive] = useState("loans");
  const [animating, setAnimating] = useState(false);
  const pendingTab = useRef<string | null>(null);

  const tab = tabs.find((t) => t.key === active)!;

  const switchTab = (key: string) => {
    if (key === active || animating) return;
    pendingTab.current = key;
    setAnimating(true);
    setTimeout(() => {
      if (pendingTab.current) setActive(pendingTab.current);
      pendingTab.current = null;
      setAnimating(false);
    }, 200);
  };

  return (
    <section className={styles.section} id="products">
      <div className="container">
        <div className={styles.header}>
          <div>
            <div className="section-label">{p.label}</div>
            <h2 className="section-title">{p.title}</h2>
            <p className="section-subtitle">{p.subtitle}</p>
          </div>
          <Link href="/products" className="btn btn-secondary">
            {p.viewAll}
          </Link>
        </div>

        <div className={styles.tabs} role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={active === t.key}
              className={`${styles.tab} ${active === t.key ? styles.tabActive : ""}`}
              onClick={() => switchTab(t.key)}
            >
              {t.label}
              <span className={styles.tabCount}>{t.products.length}</span>
            </button>
          ))}
        </div>

        <div
          className={`${styles.grid} ${animating ? styles.gridFading : styles.gridVisible}`}
          role="tabpanel"
        >
          {tab.products.map((prod, i) => (
            <Link
              key={prod.id}
              href={`${tab.base}/${prod.slug}`}
              className={styles.card}
              style={{ animationDelay: animating ? "0ms" : `${i * 40}ms` }}
            >
              <div className={styles.cardTop}>
                <span className={styles.emoji} aria-hidden="true">{prod.emoji}</span>
                <span className={styles.rate}>{prod.rate}</span>
              </div>
              <h3 className={styles.cardName}>{prod.name}</h3>
              <p className={styles.cardDesc}>{truncateWords(prod.description, 100)}</p>
              <div className={styles.cardFoot}>
                <span className={styles.features}>{prod.features.length} {p.features}</span>
                <span className={styles.arrow}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
