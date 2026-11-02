'use client';
import { useState, useEffect, useCallback } from 'react';

interface RateRow {
  product: string;
  minRate: number;
  maxRate: number;
  unit: string;
}
interface RatesData {
  loans: RateRow[];
  deposits: RateRow[];
}

export default function AdminRatesPage() {
  const [loans, setLoans] = useState<RateRow[]>([]);
  const [deposits, setDeposits] = useState<RateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fetchRates = useCallback(() => {
    return fetch('/api/admin/rates')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load');
        const data: RatesData = await res.json();
        setLoans(data.loans ?? []);
        setDeposits(data.deposits ?? []);
      })
      .catch(() => {
        setError('Could not load rates. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const updateRow = (
    arr: RateRow[],
    setArr: (v: RateRow[]) => void,
    i: number,
    key: keyof RateRow,
    val: string,
  ) => {
    const next = [...arr];
    next[i] = { ...next[i], [key]: key === 'product' || key === 'unit' ? val : Number(val) };
    setArr(next);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/rates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loans, deposits }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>Loading…</div>
    );

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
            Interest Rates
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            Edit lending and deposit rates displayed on the website.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="btn btn-primary"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          {saved ? ' Saved!' : saving ? 'Saving…' : 'Save Changes'}
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

      {[
        { title: 'Loan Interest Rates', rows: loans, setRows: setLoans },
        { title: 'Deposit Interest Rates', rows: deposits, setRows: setDeposits },
      ].map(({ title, rows, setRows }) => (
        <div key={title} style={{ marginBottom: '36px' }}>
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--green)',
              marginBottom: '12px',
            }}
          >
            {title}
          </h2>
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
                gridTemplateColumns: '2fr 1fr 1fr',
                padding: '10px 20px',
                background: 'var(--line)',
                borderBottom: '1px solid var(--line)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              <span>Product</span>
              <span>Min Rate</span>
              <span>Max Rate</span>
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  padding: '10px 20px',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <input
                  className="form-input"
                  value={row.product}
                  style={{ padding: '6px 10px', fontSize: '13px' }}
                  onChange={(e) => updateRow(rows, setRows, i, 'product', e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    className="form-input"
                    value={row.minRate}
                    step="0.5"
                    min="0"
                    max="30"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    onChange={(e) => updateRow(rows, setRows, i, 'minRate', e.target.value)}
                  />
                  <span
                    style={{
                      color: 'var(--green)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                    }}
                  >
                    %
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    className="form-input"
                    value={row.maxRate}
                    step="0.5"
                    min="0"
                    max="30"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    onChange={(e) => updateRow(rows, setRows, i, 'maxRate', e.target.value)}
                  />
                  <span
                    style={{
                      color: 'var(--green)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                    }}
                  >
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
