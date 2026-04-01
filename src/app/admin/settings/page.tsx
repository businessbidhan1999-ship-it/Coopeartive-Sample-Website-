"use client";
// src/app/admin/settings/page.tsx
import { useState, useEffect, useCallback } from "react";

interface Config {
  name: string;
  shortName: string;
  tagline: string;
  established: string;
  address: string;
  phone1: string;
  phone2: string;
  fax: string;
  email: string;
  facebook: string;
  members: number;
  branches: number;
}

const DEFAULT: Config = {
  name: "", shortName: "", tagline: "", established: "",
  address: "", phone1: "", phone2: "", fax: "", email: "",
  facebook: "", members: 0, branches: 0,
};

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<Config>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      // Flatten the nested siteConfig structure into our flat form
      setConfig({
        name: data.name ?? "",
        shortName: data.shortName ?? "",
        tagline: data.tagline ?? "",
        established: data.established ?? "",
        address: data.contact?.address ?? "",
        phone1: data.contact?.phones?.[0] ?? "",
        phone2: data.contact?.phones?.[1] ?? "",
        fax: data.contact?.fax ?? "",
        email: data.contact?.email ?? "",
        facebook: data.social?.facebook ?? "",
        members: data.stats?.members ?? 0,
        branches: data.stats?.branches ?? 0,
      });
    } catch {
      setError("Could not load settings. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const u = (key: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfig({ ...config, [key]: ["members", "branches"].includes(key) ? Number(e.target.value) : e.target.value });

  const save = async () => {
    setSaving(true);
    // Reconstruct nested siteConfig shape for the API
    const payload = {
      name: config.name,
      shortName: config.shortName,
      tagline: config.tagline,
      established: config.established,
      contact: {
        address: config.address,
        phones: [config.phone1, config.phone2].filter(Boolean),
        fax: config.fax,
        email: config.email,
        hours: { weekdays: "Sunday – Friday: 9:00 AM – 5:00 PM", saturday: "Saturday: 9:00 AM – 1:00 PM" },
      },
      social: { facebook: config.facebook },
      stats: { members: config.members, branches: config.branches },
    };
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ title, fields }: { title: string; fields: { key: keyof Config; label: string; placeholder?: string; type?: string }[] }) => (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "16px" }}>{title}</h2>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className="form-group">
            <label className="form-label">{label}</label>
            <input type={type ?? "text"} className="form-input" value={String(config[key])} placeholder={placeholder} onChange={u(key)} />
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>Site Settings</h1>
          <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.4)", marginTop: "4px" }}>Edit global website information</p>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
          {saved ? "✓ Saved!" : saving ? "Saving…" : "Save All Changes"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "16px", background: "rgba(139,26,26,0.15)", border: "1px solid rgba(139,26,26,0.3)", borderRadius: "8px", color: "#e07070", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <Section title="General" fields={[
        { key: "name", label: "Full Organization Name", placeholder: "Royal Multipurpose Cooperative..." },
        { key: "shortName", label: "Short Name", placeholder: "RMCL" },
        { key: "tagline", label: "Tagline" },
        { key: "established", label: "Established Date", placeholder: "April 22, 1998" },
      ]} />

      <Section title="Contact Information" fields={[
        { key: "address", label: "Address" },
        { key: "phone1", label: "Primary Phone", type: "tel" },
        { key: "phone2", label: "Secondary Phone", type: "tel" },
        { key: "fax", label: "Fax", type: "tel" },
        { key: "email", label: "Email", type: "email" },
      ]} />

      <Section title="Social Media" fields={[
        { key: "facebook", label: "Facebook URL" },
      ]} />

      <Section title="Statistics" fields={[
        { key: "members", label: "Total Members", type: "number" },
        { key: "branches", label: "Number of Branches", type: "number" },
      ]} />
    </div>
  );
}
