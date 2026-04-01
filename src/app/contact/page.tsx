"use client";
// src/app/contact/page.tsx
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/data";
import { isValidEmail, isValidPhone } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n-context";
import { Spinner } from "@/components/ui/Spinner";

export default function ContactPage() {
  const { t } = useLanguage();
  const c = t.contact;
  const bc = t.breadcrumb;

  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = c.errName;
    if (!isValidPhone(form.phone)) e.phone = c.errPhone;
    if (form.email && !isValidEmail(form.email)) e.email = c.errEmail;
    if (!form.message.trim()) e.message = c.errMessage;
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error ?? c.errServer);
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError(c.errNetwork);
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{bc.home}</Link><span>›</span><span>{bc.contact}</span>
          </nav>
          <h1 className="page-hero-title">{c.heroTitle}</h1>
          <p className="page-hero-sub">{c.heroSub}</p>
        </div>
      </div>

      <section className="section">
        <div className="container page-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "80px", alignItems: "start" }}>
          {/* Info */}
          <div>
            <div className="section-label">{c.label}</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, marginBottom: "28px", lineHeight: "1.2" }}>{c.sectionTitle}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}>
              {[
                { icon: "📍", label: c.labelAddress, value: siteConfig.contact.address },
                { icon: "📞", label: c.labelPhone, value: siteConfig.contact.phones.join(" | "), href: `tel:${siteConfig.contact.phones[0].replace(/\D/g, "")}` },
                { icon: "📠", label: c.labelFax, value: siteConfig.contact.fax },
                { icon: "✉️", label: c.labelEmail, value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
                { icon: "🕐", label: c.labelHours, value: `${siteConfig.contact.hours.weekdays}\n${siteConfig.contact.hours.saturday}` },
              ].map(({ icon, label, value, href }) => (
                <div key={label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "4px" }}>{label}</div>
                    {href
                      ? <a href={href} style={{ fontSize: "14px", color: "var(--royal-gold)", textDecoration: "none" }}>{value}</a>
                      : <p style={{ fontSize: "14px", color: "rgba(250,246,238,0.65)", whiteSpace: "pre-line" }}>{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
            {siteConfig.social.facebook && (
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", gap: "8px", alignItems: "center", padding: "10px 18px", background: "rgba(59,89,152,0.15)", border: "1px solid rgba(59,89,152,0.3)", borderRadius: "8px", fontSize: "13px", color: "rgba(250,246,238,0.7)", textDecoration: "none" }}>
                {c.facebook}
              </a>
            )}
          </div>

          {/* Form */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)", borderRadius: "16px", padding: "36px" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "10px" }}>{c.successTitle}</h3>
                <p style={{ fontSize: "14px", color: "rgba(250,246,238,0.6)", marginBottom: "24px" }}>{c.successMsg}</p>
                <button onClick={() => { setForm({ name:"",phone:"",email:"",subject:"",message:"" }); setSubmitted(false); }} className="btn btn-secondary">
                  {c.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "24px" }}>{c.formTitle}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cName">{c.fullName} *</label>
                    <input id="cName" className="form-input" placeholder={c.namePlaceholder} value={form.name} onChange={update("name")} />
                    {errors.name && <span style={{ fontSize: "11px", color: "#e07070", display: "block", marginTop: "4px" }}>{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cPhone">{c.phone} *</label>
                    <input id="cPhone" className="form-input" placeholder={c.phonePlaceholder} value={form.phone} onChange={update("phone")} />
                    {errors.phone && <span style={{ fontSize: "11px", color: "#e07070", display: "block", marginTop: "4px" }}>{errors.phone}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cEmail">{c.email}</label>
                  <input id="cEmail" type="email" className="form-input" placeholder={c.emailPlaceholder} value={form.email} onChange={update("email")} />
                  {errors.email && <span style={{ fontSize: "11px", color: "#e07070", display: "block", marginTop: "4px" }}>{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cSubject">{c.subject}</label>
                  <input id="cSubject" className="form-input" placeholder={c.subjectPlaceholder} value={form.subject} onChange={update("subject")} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cMessage">{c.message} *</label>
                  <textarea id="cMessage" className="form-textarea" style={{ minHeight: "130px" }} placeholder={c.messagePlaceholder} value={form.message} onChange={update("message")} />
                  {errors.message && <span style={{ fontSize: "11px", color: "#e07070", display: "block", marginTop: "4px" }}>{errors.message}</span>}
                </div>
                {serverError && <p style={{ fontSize: "13px", color: "#e07070", marginBottom: "12px" }}>{serverError}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  {loading ? <><Spinner size={14} /> {c.sending}</> : c.sendBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
