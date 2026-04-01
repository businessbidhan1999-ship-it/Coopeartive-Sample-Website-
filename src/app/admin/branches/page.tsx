"use client";
// src/app/admin/branches/page.tsx
import { useState, useEffect, useCallback } from "react";

interface Branch {
  id: string;
  name: string;
  type: string;
  inCharge: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  isHQ: boolean;
}

const EMPTY: Branch = { id: "", name: "", type: "Branch", inCharge: "", address: "", phone: "", lat: 27.7523, lng: 85.3254, isHQ: false };

export default function AdminBranchesPage() {
  const [items, setItems] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Branch | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/branches");
      if (!res.ok) throw new Error("Failed to load");
      setItems(await res.json());
    } catch {
      setError("Could not load branches. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const save = async (data: Branch) => {
    const res = await fetch("/api/admin/branches", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return alert("Save failed. Please try again.");
    const saved: Branch = await res.json();
    setItems((prev) => isNew ? [...prev, saved] : prev.map((b) => b.id === saved.id ? saved : b));
    setEditing(null);
    setIsNew(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this branch?")) return;
    const res = await fetch(`/api/admin/branches?id=${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Delete failed.");
    setItems((prev) => prev.filter((b) => b.id !== id));
  };

  if (editing) {
    return (
      <div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
          <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: "none", border: "none", color: "rgba(250,246,238,0.5)", cursor: "pointer", fontSize: "18px" }}>←</button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>{isNew ? "New Branch" : "Edit Branch"}</h1>
        </div>
        <BranchForm item={editing} onSave={save} onCancel={() => { setEditing(null); setIsNew(false); }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>Branches</h1>
          <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.4)", marginTop: "4px" }}>
            {loading ? "Loading…" : `${items.length} locations`}
          </p>
        </div>
        <button onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }} className="btn btn-primary">+ Add Branch</button>
      </div>

      {error && (
        <div style={{ padding: "16px", background: "rgba(139,26,26,0.15)", border: "1px solid rgba(139,26,26,0.3)", borderRadius: "8px", color: "#e07070", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>Loading…</div>
      ) : items.length === 0 && !error ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>No branches yet.</div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "12px", overflow: "hidden" }}>
          {items.map((branch, i) => (
            <div key={branch.id} style={{
              display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center",
              padding: "16px 20px",
              borderBottom: i < items.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none",
              background: branch.isHQ ? "rgba(139,26,26,0.05)" : "transparent"
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "3px", display: "flex", gap: "8px", alignItems: "center" }}>
                  🏢 {branch.name}
                  {branch.isHQ && <span style={{ background: "var(--royal-crimson)", color: "white", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>HQ</span>}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(250,246,238,0.35)", display: "flex", gap: "16px" }}>
                  <span>{branch.type}</span>
                  <span>📍 {branch.address}</span>
                  <span>📞 {branch.phone}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setEditing(branch); setIsNew(false); }} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "6px 14px", color: "var(--royal-gold)", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => remove(branch.id)} style={{ background: "rgba(139,26,26,0.15)", border: "1px solid rgba(139,26,26,0.25)", borderRadius: "6px", padding: "6px 14px", color: "#e07070", fontSize: "12px", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BranchForm({ item, onSave, onCancel }: { item: Branch; onSave: (d: Branch) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  const u = (key: keyof Branch) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: ["lat", "lng"].includes(key) ? Number(e.target.value) : e.target.value });

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Branch name is required.");
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "32px", maxWidth: "680px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Branch Name *</label>
          <input className="form-input" value={form.name} onChange={u("name")} placeholder="e.g. Main Branch Banking" />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={form.type} onChange={u("type")}>
            {["Head Office", "Branch", "Service Center", "Agriculture Center", "Resource Center"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">In-Charge</label>
          <input className="form-input" value={form.inCharge} onChange={u("inCharge")} placeholder="Staff name" />
        </div>
        <div className="form-group" style={{ gridColumn: "1/-1" }}>
          <label className="form-label">Address</label>
          <input className="form-input" value={form.address} onChange={u("address")} placeholder="Ward, Municipality, District" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={form.phone} onChange={u("phone")} placeholder="01-XXXXXXX" />
        </div>
        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="checkbox" id="isHQ" checked={form.isHQ} onChange={(e) => setForm({ ...form, isHQ: e.target.checked })} />
          <label htmlFor="isHQ" className="form-label" style={{ margin: 0 }}>Mark as Head Office</label>
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving…" : "Save Branch"}
        </button>
        <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
      </div>
    </div>
  );
}
