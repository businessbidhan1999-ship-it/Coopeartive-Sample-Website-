"use client";
// src/app/admin/products/page.tsx
import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  category: "loan" | "deposit" | "microfinance";
  rate: string;
  rateValue: number;
  description: string;
  features: string[];
  requirements: string[];
  facilities: string[];
}

const EMPTY: Omit<Product, "id"> = {
  slug: "", name: "", emoji: "💳",
  category: "loan", rate: "", rateValue: 0,
  description: "", features: [], requirements: [], facilities: [],
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load");
      setItems(await res.json());
    } catch {
      setError("Could not load products. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const save = async (data: Product) => {
    const res = await fetch("/api/admin/products", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return alert("Save failed. Please try again.");
    const saved: Product = await res.json();
    setItems((prev) => isNew ? [...prev, saved] : prev.map((p) => p.id === saved.id ? saved : p));
    setEditing(null);
    setIsNew(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Delete failed.");
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = filter === "all" ? items : items.filter((p) => p.category === filter);

  if (editing) {
    return (
      <ProductForm
        item={editing}
        onSave={save}
        onCancel={() => { setEditing(null); setIsNew(false); }}
        isNew={isNew}
      />
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>Products</h1>
          <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.4)", marginTop: "4px" }}>
            {loading ? "Loading…" : `${items.length} products`}
          </p>
        </div>
        <button onClick={() => { setEditing({ id: "", ...EMPTY }); setIsNew(true); }} className="btn btn-primary">+ Add Product</button>
      </div>

      {error && (
        <div style={{ padding: "16px", background: "rgba(139,26,26,0.15)", border: "1px solid rgba(139,26,26,0.3)", borderRadius: "8px", color: "#e07070", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "10px", padding: "4px", width: "fit-content" }}>
        {["all", "loan", "deposit", "microfinance"].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            background: filter === cat ? "var(--royal-crimson)" : "none",
            border: "none", borderRadius: "7px", padding: "8px 18px",
            color: filter === cat ? "white" : "rgba(250,246,238,0.5)",
            fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
            textTransform: "capitalize"
          }}>
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>No products in this category.</div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 100px auto", padding: "10px 20px", background: "rgba(201,168,76,0.04)", borderBottom: "1px solid rgba(201,168,76,0.1)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(250,246,238,0.35)", gap: "16px" }}>
            <span></span><span>Product</span><span>Category</span><span>Rate</span><span>Actions</span>
          </div>
          {filtered.map((product, i) => (
            <div key={product.id} style={{
              display: "grid", gridTemplateColumns: "40px 1fr 120px 100px auto",
              padding: "14px 20px", gap: "16px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(201,168,76,0.06)" : "none"
            }}>
              <span style={{ fontSize: "22px" }}>{product.emoji}</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{product.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(250,246,238,0.35)", marginTop: "2px" }}>
                  {product.description.slice(0, 60)}{product.description.length > 60 ? "…" : ""}
                </div>
              </div>
              <span style={{ fontSize: "11px", color: "rgba(250,246,238,0.5)", textTransform: "capitalize", background: "rgba(255,255,255,0.04)", padding: "3px 10px", borderRadius: "5px", width: "fit-content" }}>{product.category}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--royal-gold)" }}>{product.rate}</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <a href={`/products/${product.category}/${product.slug}`} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", padding: "5px 10px", color: "rgba(250,246,238,0.6)", fontSize: "11px", textDecoration: "none" }}>
                  View
                </a>
                <button onClick={() => { setEditing(product); setIsNew(false); }} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "5px", padding: "5px 10px", color: "var(--royal-gold)", fontSize: "11px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => remove(product.id)} style={{ background: "rgba(139,26,26,0.15)", border: "1px solid rgba(139,26,26,0.25)", borderRadius: "5px", padding: "5px 10px", color: "#e07070", fontSize: "11px", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput("");
  };
  return (
    <div className="form-group" style={{ gridColumn: "1/-1" }}>
      <label className="form-label">{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
        {values.map((v) => (
          <span key={v} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "5px", padding: "3px 10px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            {v}
            <button onClick={() => onChange(values.filter((x) => x !== v))} style={{ background: "none", border: "none", color: "rgba(250,246,238,0.4)", cursor: "pointer", fontSize: "12px", padding: 0 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input className="form-input" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter to add" />
        <button type="button" onClick={add} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "0 14px", color: "var(--royal-gold)", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>Add</button>
      </div>
    </div>
  );
}

function ProductForm({ item, onSave, onCancel, isNew }: { item: Product; onSave: (d: Product) => Promise<void>; onCancel: () => void; isNew: boolean }) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  const u = (key: keyof Product) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: key === "rateValue" ? Number(e.target.value) : e.target.value });

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Product name is required.");
    // Auto-generate slug if empty
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setSaving(true);
    await onSave({ ...form, slug });
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: "rgba(250,246,238,0.5)", cursor: "pointer", fontSize: "18px" }}>←</button>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>{isNew ? "New Product" : "Edit Product"}</h1>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "32px", maxWidth: "760px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={form.name} onChange={u("name")} placeholder="e.g. Agriculture Loan" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={u("category")}>
              <option value="loan">Loan</option>
              <option value="deposit">Deposit</option>
              <option value="microfinance">Microfinance</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Emoji</label>
            <input className="form-input" value={form.emoji} onChange={u("emoji")} placeholder="💳" />
          </div>
          <div className="form-group">
            <label className="form-label">Rate (display)</label>
            <input className="form-input" value={form.rate} onChange={u("rate")} placeholder="e.g. 12% – 18% p.a." />
          </div>
          <div className="form-group">
            <label className="form-label">Rate Value (for sorting)</label>
            <input type="number" className="form-input" value={form.rateValue} step="0.5" onChange={u("rateValue")} />
          </div>
          <div className="form-group">
            <label className="form-label">URL Slug</label>
            <input className="form-input" value={form.slug} onChange={u("slug")} placeholder="auto-generated if empty" />
          </div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={u("description")} placeholder="Brief description of this product" />
          </div>
          <TagInput label="Features" values={form.features} onChange={(v) => setForm({ ...form, features: v })} />
          <TagInput label="Requirements" values={form.requirements} onChange={(v) => setForm({ ...form, requirements: v })} />
          <TagInput label="Facilities" values={form.facilities} onChange={(v) => setForm({ ...form, facilities: v })} />
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Save Product"}
          </button>
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  );
}
