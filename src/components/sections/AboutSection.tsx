"use client";
// src/components/sections/AboutSection.tsx
import Link from "next/link";
import { aboutData, siteConfig } from "@/lib/data";
import { useLanguage } from "@/lib/i18n-context";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <section className={styles.section} id="about">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className="section-label">{a.label}</div>
            <h2 className="section-title">{a.title} {siteConfig.established}</h2>

            <p className={styles.intro}>{aboutData.introduction.split("\n\n")[0]}</p>

            <div className={styles.pillars}>
              {[
                { icon: "🎯", label: a.missionLabel, text: aboutData.mission },
                { icon: "👁", label: a.visionLabel, text: aboutData.vision },
                { icon: "⚖️", label: a.goalLabel, text: aboutData.goal },
              ].map(({ icon, label, text }) => (
                <div key={label} className={styles.pillar}>
                  <div className={styles.pillarIcon}>{icon}</div>
                  <div>
                    <div className={styles.pillarLabel}>{label}</div>
                    <p className={styles.pillarText}>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn btn-secondary">{a.learnMore}</Link>
          </div>

          <div className={styles.right}>
            <div className={styles.card}>
              <div className={styles.cardHead}>{a.coreObjectives}</div>
              <ul className={styles.objectives}>
                {aboutData.objectives.map((obj) => (
                  <li key={obj} className={styles.objective}>
                    <span className={styles.check} aria-hidden="true">✓</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
