"use client";
// src/app/apply/page.tsx
import Link from "next/link";
import { useState } from "react";
import { isValidEmail, isValidPhone } from "@/lib/utils";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", dob: "",
    address: "", product: "", amount: "", purpose: "", message: ""
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const validateStep1 = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!isValidPhone(form.phone)) e.phone = "Valid phone required";
    if (form.email && !isValidEmail(form.email)) e.email = "Valid email required";
    return e;
  };

  const validateStep2 = () => {
    const e: Partial<typeof form> = {};
    if (!form.product) e.product = "Select a product";
    if (!form.amount) e.amount = "Enter an amount";
    return e;
  };

  const next = () => {
    const errs = step === 1 ? validateStep1() : {};
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(step + 1);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const steps = ["Personal Info", "Product Details", "Review"];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>›</span><span>Apply Online</span>
          </nav>
          <h1 className="page-hero-title">Online Application</h1>
          <p className="page-hero-sub">Apply for any RMCL product online — we'll contact you within 1–2 working days.</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: "680px" }}>
          {!submitted ? (
            <>
              {/* Step indicator */}
              <div style={{ display: "flex", gap: "0", marginBottom: "40px" }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: step > i + 1 ? "var(--royal-gold)" : step === i + 1 ? "var(--royal-crimson)" : "rgba(255,255,255,0.08)",
                      border: `2px solid ${step >= i + 1 ? (step > i + 1 ? "var(--royal-gold)" : "var(--royal-crimson)") : "var(--royal-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 700, color: step >= i + 1 ? "white" : "rgba(250,246,238,0.3)",
                      transition: "all 0.3s"
                    }}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: "11px", color: step === i + 1 ? "var(--royal-cream)" : "rgba(250,246,238,0.3)", letterSpacing: "0.04em" }}>{s}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--royal-border)", borderRadius: "16px", padding: "36px" }}>
                <form onSubmit={submit}>
                  {step === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "24px" }}>Personal Information</h2>
                      {[
                        { id: "name", label: "Full Name *", type: "text", placeholder: "Your full name", key: "name" },
                        { id: "phone", label: "Phone Number *", type: "tel", placeholder: "+977-9XXXXXXXXX", key: "phone" },
                        { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com", key: "email" },
                        { id: "address", label: "Permanent Address", type: "text", placeholder: "Ward, Municipality, District", key: "address" },
                      ].map(({ id, label, type, placeholder, key }) => (
                        <div key={id} className="form-group">
                          <label className="form-label" htmlFor={id}>{label}</label>
                          <input id={id} type={type} className="form-input" placeholder={placeholder}
                            value={form[key as keyof typeof form]} onChange={update(key as keyof typeof form)} />
                          {errors[key as keyof typeof errors] && <span style={{ fontSize: "11px", color: "#e07070", display: "block", marginTop: "4px" }}>{errors[key as keyof typeof errors]}</span>}
                        </div>
                      ))}
                      <button type="button" onClick={next} className="btn btn-primary" style={{ marginTop: "8px" }}>
                        Continue →
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "24px" }}>Product Details</h2>
                      <div className="form-group">
                        <label className="form-label" htmlFor="product">Product *</label>
                        <select id="product" className="form-select" value={form.product} onChange={update("product")}>
                          <option value="">Select a product…</option>
                          <optgroup label="Loans">
                            {["Agriculture Loan","Business Loan","Education Loan","Housing Loan","Energy Loan","Personal Loan","Industry Loan","Hire Purchase Loan"].map(p => <option key={p} value={p}>{p}</option>)}
                          </optgroup>
                          <optgroup label="Deposits">
                            {["General Savings","Fixed Deposit","Recurring Savings","Long Term Savings"].map(p => <option key={p} value={p}>{p}</option>)}
                          </optgroup>
                          <optgroup label="Microfinance">
                            {["Microfinance Loan","Microfinance Savings"].map(p => <option key={p} value={p}>{p}</option>)}
                          </optgroup>
                        </select>
                        {errors.product && <span style={{ fontSize: "11px", color: "#e07070", display: "block", marginTop: "4px" }}>{errors.product}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="amount">Amount (NPR) *</label>
                        <input id="amount" type="number" className="form-input" placeholder="e.g. 500000"
                          value={form.amount} onChange={update("amount")} />
                        {errors.amount && <span style={{ fontSize: "11px", color: "#e07070", display: "block", marginTop: "4px" }}>{errors.amount}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="purpose">Purpose / Notes</label>
                        <textarea id="purpose" className="form-textarea" placeholder="Describe your requirement…"
                          value={form.purpose} onChange={update("purpose")} />
                      </div>
                      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                        <button type="button" onClick={() => setStep(1)} className="btn btn-ghost">← Back</button>
                        <button type="button" onClick={next} className="btn btn-primary">Review →</button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "24px" }}>Review Your Application</h2>
                      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
                        {[
                          ["Full Name", form.name], ["Phone", form.phone], ["Email", form.email || "—"],
                          ["Address", form.address || "—"], ["Product", form.product], ["Amount", `NPR ${Number(form.amount).toLocaleString()}`],
                          ["Purpose", form.purpose || "—"]
                        ].map(([label, value]) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(201,168,76,0.08)", fontSize: "14px" }}>
                            <span style={{ color: "rgba(250,246,238,0.45)" }}>{label}</span>
                            <span style={{ color: "var(--royal-cream)", fontWeight: 500 }}>{value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button type="button" onClick={() => setStep(2)} className="btn btn-ghost">← Edit</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>Submit Application ✓</button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "rgba(201,168,76,0.1)", border: "2px solid var(--royal-gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px", margin: "0 auto 24px"
              }}>✓</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", marginBottom: "14px" }}>Application Submitted!</h2>
              <p style={{ fontSize: "15px", color: "rgba(250,246,238,0.6)", lineHeight: "1.7", marginBottom: "32px" }}>
                Thank you, <strong>{form.name}</strong>. We&apos;ll contact you at <strong>{form.phone}</strong> within 1–2 working days regarding your <strong>{form.product}</strong> application.
              </p>
              <Link href="/" className="btn btn-secondary">← Back to Home</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
