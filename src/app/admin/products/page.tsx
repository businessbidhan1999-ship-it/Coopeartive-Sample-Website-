'use client';
import { ProductIcon } from '@/features/products/ProductIcon';
import { useState, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  slug: string;
  name: string;
  icon: string;
  category: 'loan' | 'deposit' | 'microfinance';
  rate: string;
  rateValue: number;
  description: string;
  features: string[];
  requirements: string[];
  facilities: string[];
}

const EMPTY: Omit<Product, 'id'> = {
  slug: '',
  name: '',
  icon: 'HandCoins',
  category: 'loan',
  rate: '',
  rateValue: 0,
  description: '',
  features: [],
  requirements: [],
  facilities: [],
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchItems = useCallback(() => {
    return fetch('/api/admin/products')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load');
        setItems(await res.json());
      })
      .catch(() => {
        setError('Could not load products. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const save = async (data: Product) => {
    const res = await fetch('/api/admin/products', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return alert('Save failed. Please try again.');
    const saved: Product = await res.json();
    setItems((prev) =>
      isNew ? [...prev, saved] : prev.map((p) => (p.id === saved.id ? saved : p)),
    );
    setEditing(null);
    setIsNew(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Delete failed.');
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = filter === 'all' ? items : items.filter((p) => p.category === filter);

  if (editing) {
    return (
      <ProductForm
        item={editing}
        onSave={save}
        onCancel={() => {
          setEditing(null);
          setIsNew(false);
        }}
        isNew={isNew}
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>
            Products
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            {loading ? 'Loading…' : `${items.length} products`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditing({ id: '', ...EMPTY });
            setIsNew(true);
          }}
          className="btn btn-primary"
        >
          + Add Product
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '16px',
            background: 'var(--sage)',
            border: '1px solid var(--sage)',
            borderRadius: '8px',
            color: '#923e31',
            fontSize: '13px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '20px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '4px',
          width: 'fit-content',
        }}
      >
        {['all', 'loan', 'deposit', 'microfinance'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? 'var(--green)' : 'none',
              border: 'none',
              borderRadius: '7px',
              padding: '8px 18px',
              color: filter === cat ? 'white' : 'var(--muted)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          No products in this category.
        </div>
      ) : (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 120px 100px auto',
              padding: '10px 20px',
              background: 'var(--line)',
              borderBottom: '1px solid var(--line)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              gap: '16px',
            }}
          >
            <span></span>
            <span>Product</span>
            <span>Category</span>
            <span>Rate</span>
            <span>Actions</span>
          </div>
          {filtered.map((product, i) => (
            <div
              key={product.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 120px 100px auto',
                padding: '14px 20px',
                gap: '16px',
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <span style={{ fontSize: '22px' }}>
                <ProductIcon name={product.icon} />
              </span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{product.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                  {product.description.slice(0, 60)}
                  {product.description.length > 60 ? '…' : ''}
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  textTransform: 'capitalize',
                  background: 'var(--surface)',
                  padding: '3px 10px',
                  borderRadius: '5px',
                  width: 'fit-content',
                }}
              >
                {product.category}
              </span>
              <span
                style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--green)' }}
              >
                {product.rate}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <a
                  href={`/products/${product.category}/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--surface)',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    color: 'var(--muted)',
                    fontSize: '11px',
                    textDecoration: 'none',
                  }}
                >
                  View
                </a>
                <button
                  onClick={() => {
                    setEditing(product);
                    setIsNew(false);
                  }}
                  style={{
                    background: 'var(--line)',
                    border: '1px solid var(--line)',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    color: 'var(--green)',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(product.id)}
                  style={{
                    background: 'var(--sage)',
                    border: '1px solid var(--sage)',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    color: '#923e31',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TagInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput('');
  };
  return (
    <div className="form-group" style={{ gridColumn: '1/-1' }}>
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {values.map((v) => (
          <span
            key={v}
            style={{
              background: 'var(--line)',
              border: '1px solid var(--line)',
              borderRadius: '5px',
              padding: '3px 10px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {v}
            <button
              onClick={() => onChange(values.filter((x) => x !== v))}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '12px',
                padding: 0,
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          className="form-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Type and press Enter to add"
        />
        <button
          type="button"
          onClick={add}
          style={{
            background: 'var(--line)',
            border: '1px solid var(--line)',
            borderRadius: '6px',
            padding: '0 14px',
            color: 'var(--green)',
            fontSize: '13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ProductForm({
  item,
  onSave,
  onCancel,
  isNew,
}: {
  item: Product;
  onSave: (d: Product) => Promise<void>;
  onCancel: () => void;
  isNew: boolean;
}) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  const u =
    (key: keyof Product) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: key === 'rateValue' ? Number(e.target.value) : e.target.value });

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Product name is required.');
    // Auto-generate slug if empty
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setSaving(true);
    await onSave({ ...form, slug });
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ←
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>
          {isNew ? 'New Product' : 'Edit Product'}
        </h1>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '760px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="admin-products-field-1">
              Product Name *
            </label>
            <input
              id="admin-products-field-1"

              className="form-input"
              value={form.name}
              onChange={u('name')}
              placeholder="e.g. Agriculture Loan"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-products-field-2">
              Category
            </label>
            <select
              id="admin-products-field-2"

              className="form-select"
              value={form.category}
              onChange={u('category')}
            >
              <option value="loan">Loan</option>
              <option value="deposit">Deposit</option>
              <option value="microfinance">Microfinance</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-products-field-3">
              Icon
            </label>
            <select
              id="admin-products-field-3"

              className="form-input"
              value={form.icon}
              onChange={u('icon')}
            >
              {[
                'Sprout',
                'Store',
                'GraduationCap',
                'Home',
                'Wallet',
                'Landmark',
                'CalendarDays',
                'Trees',
                'HandCoins',
              ].map((icon) => (
                <option key={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-products-field-4">
              Rate (display)
            </label>
            <input
              id="admin-products-field-4"

              className="form-input"
              value={form.rate}
              onChange={u('rate')}
              placeholder="e.g. 12% to 18% p.a."
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-products-field-5">
              Rate Value (for sorting)
            </label>
            <input
              id="admin-products-field-5"

              type="number"
              className="form-input"
              value={form.rateValue}
              step="0.5"
              onChange={u('rateValue')}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-products-field-6">
              URL Slug
            </label>
            <input
              id="admin-products-field-6"

              className="form-input"
              value={form.slug}
              onChange={u('slug')}
              placeholder="auto-generated if empty"
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="admin-products-field-7">
              Description
            </label>
            <textarea
              id="admin-products-field-7"

              className="form-textarea"
              value={form.description}
              onChange={u('description')}
              placeholder="Brief description of this product"
            />
          </div>
          <TagInput
            label="Features"
            values={form.features}
            onChange={(v) => setForm({ ...form, features: v })}
          />
          <TagInput
            label="Requirements"
            values={form.requirements}
            onChange={(v) => setForm({ ...form, requirements: v })}
          />
          <TagInput
            label="Facilities"
            values={form.facilities}
            onChange={(v) => setForm({ ...form, facilities: v })}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save Product'}
          </button>
          <button onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
