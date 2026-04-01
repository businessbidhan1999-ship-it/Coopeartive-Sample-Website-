"use client";
// src/components/sections/HeroSection.tsx
import { useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";
import styles from "./HeroSection.module.css";

function Counter({ target }: { target: number }) {
  const elRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const duration = 1800;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={elRef}>0</span>;
}

export function HeroSection() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section className={styles.hero} id="home" aria-labelledby="heroTitle">
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.ornament} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.badge} role="status">
          <span className={styles.badgeDot} aria-hidden="true" />
          {h.established} {siteConfig.established} · {siteConfig.stats.yearsActive} {h.badge}
        </div>

        <h1 id="heroTitle" className={styles.title}>
          {h.title1} <span className={styles.accent}>{h.title2}</span>
          <span className={styles.block}> {h.title3}</span>
          <span className={styles.block}> {h.title4}</span>
        </h1>

        <p className={styles.sub}>
          {siteConfig.name} {h.subtitle}
        </p>

        <div className={styles.actions}>
          <Link href="/products" className="btn btn-primary">
            {h.exploreProducts} <span aria-hidden="true">→</span>
          </Link>
          <Link href="/apply" className="btn btn-secondary">
            {h.applyOnline} <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className={styles.stats} aria-label="Key statistics">
          {[
            { value: siteConfig.stats.members, label: h.statMembers, suffix: "+" },
            { value: siteConfig.stats.products, label: h.statProducts, suffix: "+" },
            { value: siteConfig.stats.branches, label: h.statBranches, suffix: "+" },
            { value: siteConfig.stats.yearsActive, label: h.statYears, suffix: "", static: true },
          ].map(({ value, label, suffix, static: isStatic }) => (
            <div key={label} className={styles.stat}>
              <div className={styles.statNum} aria-label={`${value}${suffix} ${label}`}>
                {isStatic ? value : <Counter target={value} />}{suffix}
              </div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
