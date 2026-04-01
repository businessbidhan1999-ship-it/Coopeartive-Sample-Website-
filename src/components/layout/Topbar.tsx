// src/components/layout/Topbar.tsx
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import styles from "./Topbar.module.css";

export function Topbar() {
  return (
    <div className={styles.topbar} role="banner" aria-label="Contact info bar">
      <div className={styles.left}>
        <span>📍 {siteConfig.contact.address.split(",")[0]}, Kathmandu</span>
        <div className={styles.divider} />
        <Link href={`tel:${siteConfig.contact.phones[0].replace(/\D/g, "")}`} aria-label="Call us">
          📞 {siteConfig.contact.phones[0]}
        </Link>
      </div>
      <div className={styles.right}>
        <span>{siteConfig.contact.hours.weekdays}</span>
        <div className={styles.divider} />
        <Link href={`mailto:${siteConfig.contact.email}`} aria-label="Email us">
          ✉ {siteConfig.contact.email}
        </Link>
      </div>
    </div>
  );
}
