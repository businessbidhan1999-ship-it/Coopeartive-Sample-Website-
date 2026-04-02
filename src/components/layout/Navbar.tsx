"use client";
// src/components/layout/Navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n-context";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const pathname = usePathname();
  const { t, toggle: toggleLang } = useLanguage();

  const n = t.nav;

  // Build nav links from translations
  const navLinks = [
    {
      label: n.aboutUs,
      href: "/about",
      children: [
        { label: n.introduction, href: "/about" },
        { label: n.chairmanMsg, href: "/about/chairman" },
        { label: n.board, href: "/about/board" },
        { label: n.management, href: "/about/management" },
        { label: n.ourBranches, href: "/branches" },
      ],
    },
    {
      label: n.products,
      href: "/products",
      mega: true,
      columns: [
        {
          title: n.loans,
          links: [
            { label: n.agricultureLoan, href: "/products/loans/agriculture-loan" },
            { label: n.businessLoan, href: "/products/loans/business-loan" },
            { label: n.educationLoan, href: "/products/loans/education-loan" },
            { label: n.housingLoan, href: "/products/loans/housing-loan" },
            { label: n.energyLoan, href: "/products/loans/energy-loan" },
            { label: n.personalLoan, href: "/products/loans/personal-loan" },
            { label: n.industryLoan, href: "/products/loans/industry-loan" },
            { label: n.hirePurchaseLoan, href: "/products/loans/hire-purchase-loan" },
          ],
        },
        {
          title: n.deposits,
          links: [
            { label: n.generalSavings, href: "/products/deposits/general-savings" },
            { label: n.fixedDeposit, href: "/products/deposits/fixed-deposit" },
            { label: n.recurringSavings, href: "/products/deposits/recurring-savings" },
            { label: n.longTermSavings, href: "/products/deposits/long-term-savings" },
          ],
        },
        {
          title: n.microfinance,
          links: [
            { label: n.microfinanceDept, href: "/products/microfinance/microfinance-dept" },
            { label: n.microfinanceLoans, href: "/products/microfinance/microfinance-loan" },
            { label: n.microfinanceSavings, href: "/products/microfinance/microfinance-savings" },
          ],
        },
      ],
    },
    { label: n.interestRates, href: "/products#rates" },
    { label: n.news, href: "/news" },
    { label: n.branches, href: "/branches" },
    { label: n.contact, href: "/contact" },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenAccordion(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  const toggleAccordion = (label: string) =>
    setOpenAccordion((prev) => (prev === label ? null : label));

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link href="/" className={styles.logo} aria-label="RMCL Home">
          <div className={styles.logoIcon} aria-hidden="true">R</div>
          <div className={styles.logoText}>
            <strong>RMCL</strong>
            <span>{n.est}</span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {navLinks.map((item) => (
            <li key={item.href} className={styles.item}>
              <Link
                href={item.href}
                className={`${styles.link} ${isActive(item.href) ? styles.active : ""}`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
                {(item.children || item.mega) && (
                  <span className={styles.chevron} aria-hidden="true">▾</span>
                )}
              </Link>

              {item.children && !item.mega && (
                <div className={styles.dropdown} role="menu">
                  <div className={styles.dropdownInner}>
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className={styles.dropdownLink} role="menuitem">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {item.mega && item.columns && (
                <div className={styles.mega} role="menu">
                  <div className={styles.megaInner}>
                    {item.columns.map((col) => (
                      <div key={col.title} className={styles.megaCol}>
                        <div className={styles.megaTitle}>{col.title}</div>
                        {col.links.map((link) => (
                          <Link key={link.href} href={link.href} className={styles.dropdownLink} role="menuitem">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}

          {/* Language toggle */}
          <li>
            <button
              onClick={toggleLang}
              className={styles.langToggle}
              aria-label="Switch language"
            >
              {t.langToggle}
            </button>
          </li>

          <li>
            <Link href="/apply" className={`${styles.link} ${styles.cta}`}>
              {n.applyOnline}
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? n.closeMenu : n.openMenu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Backdrop */}
      <div
        className={`${styles.mobileBackdrop} ${mobileOpen ? styles.mobileBackdropOpen : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile side panel */}
      <div
        id="mobile-nav"
        className={`${styles.mobile} ${mobileOpen ? styles.mobileOpen : ""}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.mobilePanelHeader}>
          <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
            <div className={styles.logoIcon} aria-hidden="true">R</div>
            <div className={styles.logoText}>
              <strong>RMCL</strong>
              <span>{n.estShort}</span>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={toggleLang}
              className={styles.langToggle}
              aria-label="Switch language"
            >
              {t.langToggle}
            </button>
            <button className={styles.mobileClose} onClick={() => setMobileOpen(false)} aria-label={n.closeMenu}>
              ✕
            </button>
          </div>
        </div>

        {/* Nav items */}
        <nav className={styles.mobileNav}>
          {navLinks.map((item) => {
            const hasChildren = item.children || item.mega;
            const isOpen = openAccordion === item.label;

            if (!hasChildren) {
              return (
                <div key={item.href} className={styles.mobileItem}>
                  <Link href={item.href} className={styles.mobileLinkRow} style={{ textDecoration: "none" }}>
                    {item.label}
                  </Link>
                </div>
              );
            }

            return (
              <div key={item.href} className={styles.mobileItem}>
                <button
                  className={styles.mobileLinkRow}
                  onClick={() => toggleAccordion(item.label)}
                  aria-expanded={isOpen}
                >
                  {item.label}
                  <span className={`${styles.mobileChevron} ${isOpen ? styles.mobileChevronOpen : ""}`}>▾</span>
                </button>

                <div className={`${styles.mobileAccordion} ${isOpen ? styles.mobileAccordionOpen : ""}`}>
                  {item.children && !item.mega && (
                    <div className={styles.mobileSubGroup}>
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className={styles.mobileSubLink}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {item.mega && item.columns && item.columns.map((col) => (
                    <div key={col.title} className={styles.mobileSubGroup}>
                      <div className={styles.mobileSubTitle}>{col.title}</div>
                      {col.links.map((link) => (
                        <Link key={link.href} href={link.href} className={styles.mobileSubLink}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <Link href="/apply" className={styles.mobileCta}>
            {n.applyOnline} →
          </Link>
        </nav>
      </div>
    </>
  );
}
