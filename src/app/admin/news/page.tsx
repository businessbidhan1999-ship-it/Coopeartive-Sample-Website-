'use client';
import { useState, useEffect, useCallback } from 'react';
import { formatDate } from '@/lib/utils';

import type { NewsItem } from '@/types/content';

const EMPTY: Omit<NewsItem, 'id'> = {
  title: '',
  excerpt: '',
  content: '',
  date: new Date().toISOString().slice(0, 10),
  category: 'Announcement',
  featured: false,
  imageUrl: '',
  imageAlt: '',
};

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchItems = useCallback(() => {
    return fetch('/api/admin/news')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load');
        setItems(await res.json());
      })
      .catch(() => {
        setError('Could not load news items. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const save = async (data: NewsItem) => {
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch('/api/admin/news', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return alert('Save failed. Please try again.');
    const saved: NewsItem = await res.json();
    setItems((prev) =>
      isNew ? [saved, ...prev] : prev.map((i) => (i.id === saved.id ? saved : i)),
    );
    setEditing(null);
    setIsNew(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    const res = await fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Delete failed.');
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const startNew = () => {
    setEditing({ id: '', ...EMPTY });
    setIsNew(true);
  };

  if (editing) {
    return (
      <NewsForm
        item={editing}
        onSave={save}
        onCancel={() => {
          setEditing(null);
          setIsNew(false);
        }}
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
            News & Notices
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            {loading ? 'Loading…' : `${items.length} items`}
          </p>
        </div>
        <button onClick={startNew} className="btn btn-primary">
          + Add Article
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
          No articles yet. Add one above.
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
          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr auto',
                gap: '16px',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '3px' }}>
                  {item.title}
                </div>
                <div
                  style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '12px' }}
                >
                  <span>{formatDate(item.date)}</span>
                  <span>{item.category}</span>
                  {item.featured && <span style={{ color: '#923e31' }}> Featured</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setEditing(item);
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
                  onClick={() => remove(item.id)}
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

function NewsForm({
  item,
  onSave,
  onCancel,
}: {
  item: NewsItem;
  onSave: (d: NewsItem) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  const u =
    (key: keyof NewsItem) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const handleSave = async () => {
    if (!form.title.trim()) return alert('Title is required.');
    setSaving(true);
    await onSave(form);
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
          {item.id ? 'Edit Article' : 'New Article'}
        </h1>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '720px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="admin-news-field-1">
              Title *
            </label>
            <input
              id="admin-news-field-1"

              className="form-input"
              value={form.title}
              onChange={u('title')}
              placeholder="Article title"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-news-field-2">
              Category
            </label>
            <select
              id="admin-news-field-2"

              className="form-select"
              value={form.category}
              onChange={u('category')}
            >
              {['Announcement', 'News', 'Notice', 'Event', 'Update'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-news-field-3">
              Date
            </label>
            <input
              id="admin-news-field-3"

              type="date"
              className="form-input"
              value={form.date}
              onChange={u('date')}
            />
          </div>

          <div
            className="form-group"
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="form-label" style={{ margin: 0 }}>
              Mark as Featured
            </label>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="news-image">
              Article image path
            </label>
            <input
              id="news-image"
              className="form-input"
              value={form.imageUrl || ''}
              onChange={u('imageUrl')}
              placeholder="/images/news/your-article.webp"
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="news-image-alt">
              Image description
            </label>
            <input
              id="news-image-alt"
              className="form-input"
              value={form.imageAlt || ''}
              onChange={u('imageAlt')}
              placeholder="Describe what this article’s image shows"
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="admin-news-field-4">
              Excerpt *
            </label>
            <textarea
              id="admin-news-field-4"

              className="form-textarea"
              value={form.excerpt}
              onChange={u('excerpt')}
              placeholder="Short summary (shown in listings)"
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="admin-news-field-5">
              Full Content *
            </label>
            <textarea
              id="admin-news-field-5"

              className="form-textarea"
              style={{ minHeight: '180px' }}
              value={form.content}
              onChange={u('content')}
              placeholder="Full article content…"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save Article'}
          </button>
          <button onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
