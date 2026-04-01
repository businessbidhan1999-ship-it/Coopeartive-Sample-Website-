"use client";
// src/components/sections/BranchesSection.tsx
import Link from "next/link";
import { branches } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";
import styles from "./BranchesSection.module.css";

export function BranchesSection() {
  const { t } = useLanguage();
  const b = t.branches;

  return (
    <section className={styles.section} id="branches">
      <div className="container">
        <div className={styles.header}>
          <div>
            <div className="section-label">{b.label}</div>
            <h2 className="section-title">{b.title}</h2>
            <p className="section-subtitle">
              {b.subtitle.replace("{count}", String(branches.length))}
            </p>
          </div>
          <Link href="/branches" className="btn btn-secondary">{b.viewAll}</Link>
        </div>
        <div className={styles.grid}>
          {branches.map((branch) => (
            <div key={branch.id} className={`${styles.card} ${branch.isHQ ? styles.hq : ""}`}>
              <div className={styles.cardTop}>
                <div className={styles.typeRow}>
                  <span className={styles.type}>{branch.type}</span>
                  {branch.isHQ && <span className={styles.hqBadge}>{b.hqBadge}</span>}
                </div>
                <span className={styles.icon} aria-hidden="true">🏢</span>
              </div>
              <h3 className={styles.name}>{branch.name}</h3>
              <p className={styles.inCharge}>{b.inCharge}: {branch.inCharge}</p>
              <p className={styles.address}>📍 {branch.address}</p>
              <a href={`tel:${branch.phone.split(/[,/]/)[0].trim().replace(/[^0-9+]/g, "")}`} className={styles.phone}>
                📞 {branch.phone.split(/[,/]/)[0].trim()}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
