// src/components/sections/ServicesSection.tsx
import styles from "./ServicesSection.module.css";

const services = [
  { icon: "🏦", title: "Cooperative Banking", desc: "Full-service banking including savings, current, and fixed deposit accounts with ABBS connectivity." },
  { icon: "🤝", title: "Microfinance", desc: "Group-based lending and savings programs empowering low-income households and rural communities." },
  { icon: "🛡️", title: "Insurance", desc: "Facilitate life and property insurance products to protect members and their families." },
  { icon: "💸", title: "Remittance", desc: "Domestic and international remittance services enabling members to send and receive money conveniently." },
  { icon: "📱", title: "Digital Payment", desc: "Mobile banking, internet banking, QR payments and digital wallets for seamless transactions." },
  { icon: "🌾", title: "Agro-Business", desc: "Agricultural advisory, input supply linkages, and dedicated agro-resource centers for farmer members." },
  { icon: "🎓", title: "Cooperative Education", desc: "Training programs, financial literacy workshops, and cooperative education for members and community." },
  { icon: "💼", title: "Loan Products", desc: "A comprehensive suite of 8+ loan types covering agriculture, housing, education, business, and more." },
];

export function ServicesSection() {
  return (
    <section className={styles.section} id="services">
      <div className="container">
        <div className={styles.header}>
          <div className="section-label">Our Services</div>
          <h2 className="section-title">One Cooperative, Complete Financial Solutions</h2>
          <p className="section-subtitle">
            RMCL delivers a full spectrum of financial and non-financial services under one roof — serving all age groups and economic backgrounds.
          </p>
        </div>
        <div className={styles.grid}>
          {services.map(({ icon, title, desc }) => (
            <div key={title} className={styles.card}>
              <div className={styles.icon} aria-hidden="true">{icon}</div>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.desc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
