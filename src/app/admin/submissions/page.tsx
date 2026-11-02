'use client';
import { useState, useEffect, useCallback } from 'react';

interface Application {
  id: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'contacted';
  name: string;
  phone: string;
  email: string;
  product: string;
  message: string;
}

interface ContactMessage {
  id: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'replied';
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

type Tab = 'applications' | 'contacts';

const STATUS_COLORS: Record<string, string> = {
  new: 'var(--line)',
  reviewed: 'rgba(100,160,100,0.15)',
  contacted: 'rgba(100,140,200,0.15)',
  replied: 'rgba(100,140,200,0.15)',
};

const STATUS_TEXT: Record<string, string> = {
  new: '#c9a84c',
  reviewed: '#7bc97b',
  contacted: '#7baee0',
  replied: '#7baee0',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-NP', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function SubmissionsPage() {
  const [tab, setTab] = useState<Tab>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchData = useCallback((type: Tab) => {
    return fetch(`/api/admin/submissions?type=${type}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setError('');
        if (type === 'applications') setApplications(data);
        else setContacts(data);
      })
      .catch(() => {
        setError('Could not load submissions. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(tab);
  }, [tab, fetchData]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/submissions?type=${tab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      if (tab === 'applications') {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: status as Application['status'] } : a)),
        );
      } else {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: status as ContactMessage['status'] } : c)),
        );
      }
    } catch {
      alert('Status update failed.');
    } finally {
      setUpdating(null);
    }
  };

  const items = tab === 'applications' ? applications : contacts;
  const appStatuses = ['new', 'reviewed', 'contacted'];
  const contactStatuses = ['new', 'reviewed', 'replied'];
  const statuses = tab === 'applications' ? appStatuses : contactStatuses;

  const newCount = (arr: { status: string }[]) => arr.filter((i) => i.status === 'new').length;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>
          Form Submissions
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
          Review and manage incoming applications and contact messages.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['applications', 'contacts'] as Tab[]).map((t) => {
          const count = newCount(t === 'applications' ? applications : contacts);
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: active ? '1px solid var(--line)' : '1px solid var(--line)',
                background: active ? 'var(--line)' : 'transparent',
                color: active ? 'var(--green)' : 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {t === 'applications' ? 'Applications' : 'Contact Messages'}
              {count > 0 && (
                <span
                  style={{
                    background: '#c9a84c',
                    color: '#1a1207',
                    borderRadius: '10px',
                    padding: '1px 7px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading…</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#923e31' }}>{error}</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          No {tab === 'applications' ? 'applications' : 'messages'} yet.
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
          {items.map((item, i) => {
            const isOpen = expanded === item.id;
            const app = item as Application;
            const msg = item as ContactMessage;
            return (
              <div
                key={item.id}
                style={{ borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none' }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '14px 20px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '3px' }}>
                      {item.name}
                      {tab === 'applications' && app.product && (
                        <span
                          style={{
                            marginLeft: '10px',
                            fontSize: '11px',
                            fontWeight: 400,
                            color: 'var(--muted)',
                          }}
                        >
                          → {app.product}
                        </span>
                      )}
                      {tab === 'contacts' && msg.subject && (
                        <span
                          style={{
                            marginLeft: '10px',
                            fontSize: '11px',
                            fontWeight: 400,
                            color: 'var(--muted)',
                          }}
                        >
                          , {msg.subject}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--muted)',
                        display: 'flex',
                        gap: '12px',
                      }}
                    >
                      <span>{formatDate(item.submittedAt)}</span>
                      <span>{item.phone}</span>
                      {item.email && <span>{item.email}</span>}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: STATUS_COLORS[item.status] ?? 'var(--line)',
                      color: STATUS_TEXT[item.status] ?? 'var(--muted)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
                {isOpen && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--line)' }}>
                    <div
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '12px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: 'var(--muted)',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {item.message || (
                        <em style={{ color: 'var(--muted)' }}>No message provided.</em>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--muted)', marginRight: '4px' }}>
                        Update status:
                      </span>
                      {statuses.map((s) => (
                        <button
                          key={s}
                          disabled={item.status === s || updating === item.id}
                          onClick={() => updateStatus(item.id, s)}
                          style={{
                            padding: '5px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: item.status === s ? 'default' : 'pointer',
                            border:
                              item.status === s
                                ? `1px solid ${STATUS_TEXT[s]}`
                                : '1px solid var(--line)',
                            background:
                              item.status === s
                                ? (STATUS_COLORS[s] ?? 'transparent')
                                : 'transparent',
                            color: item.status === s ? STATUS_TEXT[s] : 'var(--muted)',
                            textTransform: 'capitalize',
                            opacity: updating === item.id && item.status !== s ? 0.5 : 1,
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
