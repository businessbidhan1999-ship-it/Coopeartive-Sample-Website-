"use client";
// src/components/sections/ApplySection.tsx
import { useState } from "react";
import { isValidEmail, isValidPhone } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n-context";
import { Spinner } from "@/components/ui/Spinner";
import styles from "./ApplySection.module.css";

export function ApplySection() {
  const { t } = useLanguage();
  const a = t.apply;

  const [form, setForm] = useState({ name: "", phone: "", email: "", product: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = a.errName;
    if (!isValidPhone(form.phone)) e.phone = a.errPhone;
    if (form.email && !isValidEmail(form.email)) e.email = a.errEmail;
    if (!form.product) e.product = a.errProduct;
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/public/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error ?? a.errServer);
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError(a.errNetwork);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} id="apply">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className="section-label">{a.label}</div>
            <h2 className="section-title">{a.title}</h2>
            <p className="section-subtitle">{a.subtitle}</p>
            <div className={styles.points}>
              {[
                { icon: "⚡", text: a.point1 },
                { icon: "🔒", text: a.point2 },
                { icon: "📋", text: a.point3 },
                { icon: "🤝", text: a.point4 },
              ].map(({ icon, text }) => (
                <div key={text} className={styles.point}>
                  <span className={styles.pointIcon}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.right}>
            {submitted ? (
              <div className={styles.success} role="alert">
                <div className={styles.successIcon}>✓</div>
                <h3>{a.successTitle}</h3>
                <p>Thank you, {form.name}. {a.successMsg.replace("{phone}", form.phone)}</p>
                <button className="btn btn-secondary" onClick={() => { setForm({ name:"",phone:"",email:"",product:"",message:"" }); setSubmitted(false); }}>
                  {a.submitAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="applyName">{a.fullName} *</label>
                  <input id="applyName" className="form-input" placeholder={a.fullNamePlaceholder} value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  {errors.name && <span className={styles.error}>{errors.name}</span>}
                </div>
                <div className={styles.row}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="applyPhone">{a.phone} *</label>
                    <input id="applyPhone" className="form-input" placeholder={a.phonePlaceholder} value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="applyEmail">{a.email}</label>
                    <input id="applyEmail" type="email" className="form-input" placeholder={a.emailPlaceholder} value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="applyProduct">{a.productOfInterest} *</label>
                  <select id="applyProduct" className="form-select" value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}>
                    <option value="">{a.selectProduct}</option>
                    <optgroup label={a.groupLoans}>
                      {["Agriculture Loan","Business Loan","Education Loan","Housing Loan","Energy Loan","Personal Loan","Industry Loan","Hire Purchase Loan"].map(p => <option key={p} value={p}>{p}</option>)}
                    </optgroup>
                    <optgroup label={a.groupDeposits}>
                      {["General Savings","Fixed Deposit","Recurring Savings","Long Term Savings"].map(p => <option key={p} value={p}>{p}</option>)}
                    </optgroup>
                    <optgroup label={a.groupMicrofinance}>
                      {["Microfinance Loan","Microfinance Savings"].map(p => <option key={p} value={p}>{p}</option>)}
                    </optgroup>
                  </select>
                  {errors.product && <span className={styles.error}>{errors.product}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="applyMsg">{a.message}</label>
                  <textarea id="applyMsg" className="form-textarea" placeholder={a.messagePlaceholder}
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                {serverError && <p style={{ fontSize: "13px", color: "#e07070", marginBottom: "12px" }}>{serverError}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  {loading ? <><Spinner size={14} /> {a.submitting}</> : a.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
