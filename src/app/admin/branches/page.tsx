'use client';
import { useState, useEffect, useCallback } from 'react';

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

const EMPTY: Branch = {
  id: '',
  name: '',
  type: 'Branch',
  inCharge: '',
  address: '',
  phone: '',
  lat: 27.7523,
  lng: 85.3254,
  isHQ: false,
};

export default function AdminBranchesPage() {
  const [items, setItems] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Branch | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchItems = useCallback(() => {
    return fetch('/api/admin/branches')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load');
        setItems(await res.json());
      })
      .catch(() => {
        setError('Could not load branches. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const save = async (data: Branch) => {
    const res = await fetch('/api/admin/branches', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return alert('Save failed. Please try again.');
    const saved: Branch = await res.json();
    setItems((prev) =>
      isNew ? [...prev, saved] : prev.map((b) => (b.id === saved.id ? saved : b)),
    );
    setEditing(null);
    setIsNew(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this branch?')) return;
    const res = await fetch(`/api/admin/branches?id=${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Delete failed.');
    setItems((prev) => prev.filter((b) => b.id !== id));
  };

  if (editing) {
    return (
      <div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => {
              setEditing(null);
              setIsNew(false);
            }}
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
            {isNew ? 'New Branch' : 'Edit Branch'}
          </h1>
        </div>
        <BranchForm
          item={editing}
          onSave={save}
          onCancel={() => {
            setEditing(null);
            setIsNew(false);
          }}
        />
      </div>
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
            Branches
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            {loading ? 'Loading…' : `${items.length} locations`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditing({ ...EMPTY });
            setIsNew(true);
          }}
          className="btn btn-primary"
        >
          + Add Branch
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading…</div>
      ) : items.length === 0 && !error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          No branches yet.
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
          {items.map((branch, i) => (
            <div
              key={branch.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '16px',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none',
                background: branch.isHQ ? 'var(--sage)' : 'transparent',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '3px',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  {branch.name}
                  {branch.isHQ && (
                    <span
                      style={{
                        background: 'var(--green)',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      HQ
                    </span>
                  )}
                </div>
                <div
                  style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '16px' }}
                >
                  <span>{branch.type}</span>
                  <span> {branch.address}</span>
                  <span> {branch.phone}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setEditing(branch);
                    setIsNew(false);
                  }}
                  style={{
                    background: 'var(--line)',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    color: 'var(--green)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(branch.id)}
                  style={{
                    background: 'var(--sage)',
                    border: '1px solid var(--sage)',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    color: '#923e31',
                    fontSize: '12px',
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

function BranchForm({
  item,
  onSave,
  onCancel,
}: {
  item: Branch;
  onSave: (d: Branch) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  const u = (key: keyof Branch) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({
      ...form,
      [key]: ['lat', 'lng'].includes(key) ? Number(e.target.value) : e.target.value,
    });

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Branch name is required.');
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '680px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label className="form-label" htmlFor="admin-branches-field-1">
            Branch Name *
          </label>
          <input
            id="admin-branches-field-1"

            className="form-input"
            value={form.name}
            onChange={u('name')}
            placeholder="e.g. Main Branch Banking"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="admin-branches-field-2">
            Type
          </label>
          <select
            id="admin-branches-field-2"

            className="form-select"
            value={form.type}
            onChange={u('type')}
          >
            {[
              'Head Office',
              'Branch',
              'Service Center',
              'Agriculture Center',
              'Resource Center',
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="admin-branches-field-3">
            In-Charge
          </label>
          <input
            id="admin-branches-field-3"

            className="form-input"
            value={form.inCharge}
            onChange={u('inCharge')}
            placeholder="Staff name"
          />
        </div>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label className="form-label" htmlFor="admin-branches-field-4">
            Address
          </label>
          <input
            id="admin-branches-field-4"

            className="form-input"
            value={form.address}
            onChange={u('address')}
            placeholder="Ward, Municipality, District"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="admin-branches-field-5">
            Phone
          </label>
          <input
            id="admin-branches-field-5"

            className="form-input"
            value={form.phone}
            onChange={u('phone')}
            placeholder="01-XXXXXXX"
          />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="isHQ"
            checked={form.isHQ}
            onChange={(e) => setForm({ ...form, isHQ: e.target.checked })}
          />
          <label htmlFor="isHQ" className="form-label" style={{ margin: 0 }}>
            Mark as Head Office
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving…' : 'Save Branch'}
        </button>
        <button onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}
