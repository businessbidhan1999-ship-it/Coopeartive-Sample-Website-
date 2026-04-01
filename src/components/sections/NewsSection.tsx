"use client";
// src/components/sections/NewsSection.tsx
import Link from "next/link";
import { newsItems } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n-context";
import styles from "./NewsSection.module.css";

export function NewsSection() {
  const { t } = useLanguage();
  const n = t.news;

  const featured = newsItems.filter((item) => item.featured);
  const rest = newsItems.filter((item) => !item.featured);
  const display = [...featured, ...rest].slice(0, 4);

  return (
    <section className={styles.section} id="news">
      <div className="container">
        <div className={styles.header}>
          <div>
            <div className="section-label">{n.label}</div>
            <h2 className="section-title">{n.title}</h2>
          </div>
          <Link href="/news" className="btn btn-secondary">{n.viewAll}</Link>
        </div>
        <div className={styles.grid}>
          {display.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.emoji}>{item.emoji}</span>
                <span className={`badge badge-gold ${styles.category}`}>{item.category}</span>
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.excerpt}>{item.excerpt}</p>
              <div className={styles.footer}>
                <time dateTime={item.date} className={styles.date}>{formatDate(item.date)}</time>
                <span className={styles.arrow}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
