"use client";
// src/components/sections/TickerSection.tsx
import { tickerItems } from "@/lib/data";
import styles from "./TickerSection.module.css";

export function TickerSection() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className={styles.wrap} role="marquee" aria-label="News ticker">
      <div className={styles.label} aria-hidden="true">LIVE</div>
      <div className={styles.track}>
        <div className={styles.inner}>
          {doubled.map((item, i) => (
            <span key={i} className={styles.item}>
              {item}
              <span className={styles.dot} aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
