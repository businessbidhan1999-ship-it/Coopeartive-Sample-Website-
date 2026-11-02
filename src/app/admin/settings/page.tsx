'use client';
import { useState, useEffect, useCallback } from 'react';

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
  name: '',
  shortName: '',
  tagline: '',
  established: '',
  address: '',
  phone1: '',
  phone2: '',
  fax: '',
  email: '',
  facebook: '',
  members: 0,
  branches: 0,
};

const SettingsSection = ({
  title,
  fields,
  config,
  onChange,
}: {
  config: Config;
  onChange: (key: keyof Config) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  fields: { key: keyof Config; label: string; placeholder?: string; type?: string }[];
}) => (
  <div style={{ marginBottom: '36px' }}>
    <h2
      style={{
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--green)',
        marginBottom: '16px',
      }}
    >
      {title}
    </h2>
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}
    >
      {fields.map(({ key, label, placeholder, type }) => (
        <div key={key} className="form-group">
          <label className="form-label" htmlFor={`settings-${key}`}>
            {label}
          </label>
          <input
            id={`settings-${key}`}

            type={type ?? 'text'}
            className="form-input"
            value={String(config[key])}
            placeholder={placeholder}
            onChange={onChange(key)}
          />
        </div>
      ))}
    </div>
  </div>
);

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<Config>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = useCallback(() => {
    return fetch('/api/admin/settings')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setError('');
        // Flatten the nested siteConfig structure into our flat form
        setConfig({
          name: data.name ?? '',
          shortName: data.shortName ?? '',
          tagline: data.tagline ?? '',
          established: data.established ?? '',
          address: data.contact?.address ?? '',
          phone1: data.contact?.phones?.[0] ?? '',
          phone2: data.contact?.phones?.[1] ?? '',
          fax: data.contact?.fax ?? '',
          email: data.contact?.email ?? '',
          facebook: data.social?.facebook ?? '',
          members: data.stats?.members ?? 0,
          branches: data.stats?.branches ?? 0,
        });
      })
      .catch(() => {
        setError('Could not load settings. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const u = (key: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfig({
      ...config,
      [key]: ['members', 'branches'].includes(key) ? Number(e.target.value) : e.target.value,
    });

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
        hours: {
          weekdays: 'Sunday to Friday: 9:00 AM to 5:00 PM',
          saturday: 'Saturday: 9:00 AM to 1:00 PM',
        },
      },
      social: { facebook: config.facebook },
      stats: { members: config.members, branches: config.branches },
    };
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
            Site Settings
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            Edit global website information
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="btn btn-primary"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          {saved ? ' Saved!' : saving ? 'Saving…' : 'Save All Changes'}
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

      <SettingsSection
        config={config}
        onChange={u}
        title="General"
        fields={[
          { key: 'name', label: 'Full Organization Name', placeholder: 'Mero Sahakari' },
          { key: 'shortName', label: 'Short Name', placeholder: 'Mero Sahakari' },
          { key: 'tagline', label: 'Tagline' },
          { key: 'established', label: 'Established Date', placeholder: 'April 22, 1998' },
        ]}
      />

      <SettingsSection
        config={config}
        onChange={u}
        title="Contact Information"
        fields={[
          { key: 'address', label: 'Address' },
          { key: 'phone1', label: 'Primary Phone', type: 'tel' },
          { key: 'phone2', label: 'Secondary Phone', type: 'tel' },
          { key: 'fax', label: 'Fax', type: 'tel' },
          { key: 'email', label: 'Email', type: 'email' },
        ]}
      />

      <SettingsSection
        config={config}
        onChange={u}
        title="Social Media"
        fields={[{ key: 'facebook', label: 'Facebook URL' }]}
      />

      <SettingsSection
        config={config}
        onChange={u}
        title="Statistics"
        fields={[
          { key: 'members', label: 'Total Members', type: 'number' },
          { key: 'branches', label: 'Number of Branches', type: 'number' },
        ]}
      />
    </div>
  );
}
