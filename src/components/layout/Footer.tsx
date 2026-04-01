"use client";
// src/components/layout/Footer.tsx
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>R</div>
            <div>
              <strong className={styles.logoName}>RMCL</strong>
              <span className={styles.logoSub}>Royal Multipurpose Cooperative</span>
            </div>
          </div>
          <p>{f.tagline} {siteConfig.established}. {f.registered} {siteConfig.registrationAct}.</p>
          <div className={styles.badges}>
            <span className={styles.badge}>🔒 {f.ssl}</span>
            <span className={styles.badge}>🔒 {f.https}</span>
          </div>
        </div>

        <div>
          <div className={styles.colTitle}>{f.quickLinks}</div>
          <ul className={styles.links}>
            {[
              [f.linkAbout, "/about"],
              [f.linkProducts, "/products"],
              [f.linkRates, "/products#rates"],
              [f.linkBranches, "/branches"],
              [f.linkNews, "/news"],
              [f.linkApply, "/apply"],
              [f.linkContact, "/contact"],
            ].map(([label, href]) => (
              <li key={href}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className={styles.colTitle}>{f.productsCol}</div>
          <ul className={styles.links}>
            {[
              [f.linkAgriculture, "/products/loans/agriculture-loan"],
              [f.linkBusiness, "/products/loans/business-loan"],
              [f.linkHousing, "/products/loans/housing-loan"],
              [f.linkFD, "/products/deposits/fixed-deposit"],
              [f.linkSavings, "/products/deposits/general-savings"],
              [f.linkMicrofinance, "/products/microfinance/microfinance-dept"],
            ].map(([label, href]) => (
              <li key={href}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className={styles.colTitle}>{f.contactCol}</div>
          <address className={styles.address}>
            <p>{siteConfig.contact.address}</p>
            <p>{f.poBox}: {siteConfig.contact.poBox}</p>
            {siteConfig.contact.phones.map((p) => (
              <p key={p}><Link href={`tel:${p.replace(/\D/g, "")}`}>{p}</Link></p>
            ))}
            <p><Link href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</Link></p>
            <p className={styles.hours}>{siteConfig.contact.hours.weekdays}</p>
            <p className={styles.hours}>{siteConfig.contact.hours.saturday}</p>
          </address>
        </div>
      </div>

      <hr className="divider" />

      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} {siteConfig.name}. {f.copyright}</p>
        <p className={styles.reg}>{f.reg} {siteConfig.registrationAct}</p>
      </div>
    </footer>
  );
}
