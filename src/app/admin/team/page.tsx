"use client";
// src/app/admin/team/page.tsx
import { useState, useEffect, useCallback } from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}

interface ChairmanData {
  name: string;
  title: string;
  message: string;
  imageUrl: string;
}

interface TeamData {
  chairman: ChairmanData;
  boardOfDirectors: TeamMember[];
  topManagement: TeamMember[];
}

type Section = "board" | "management";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ member: TeamMember; section: Section } | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editingChairman, setEditingChairman] = useState(false);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/team");
      if (!res.ok) throw new Error("Failed to load");
      setTeam(await res.json());
    } catch {
      setError("Could not load team data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  const saveMember = async (data: TeamMember) => {
    const action = isNew ? "add" : "update";
    const section = editing!.section;
    const res = await fetch("/api/admin/team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, section, member: data }),
    });
    if (!res.ok) return alert("Save failed. Please try again.");
    const saved: TeamMember = await res.json();
    setTeam((prev) => {
      if (!prev) return prev;
      const arr = section === "board" ? [...prev.boardOfDirectors] : [...prev.topManagement];
      if (isNew) arr.push(saved);
      else { const idx = arr.findIndex((m) => m.id === saved.id); if (idx !== -1) arr[idx] = saved; }
      return section === "board"
        ? { ...prev, boardOfDirectors: arr }
        : { ...prev, topManagement: arr };
    });
    setEditing(null);
    setIsNew(false);
  };

  const removeMember = async (id: string, section: Section) => {
    if (!confirm("Remove this member?")) return;
    const res = await fetch("/api/admin/team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", section, id }),
    });
    if (!res.ok) return alert("Delete failed.");
    setTeam((prev) => {
      if (!prev) return prev;
      return section === "board"
        ? { ...prev, boardOfDirectors: prev.boardOfDirectors.filter((m) => m.id !== id) }
        : { ...prev, topManagement: prev.topManagement.filter((m) => m.id !== id) };
    });
  };

  const saveChairman = async (data: ChairmanData) => {
    const res = await fetch("/api/admin/team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-chairman", chairman: data }),
    });
    if (!res.ok) return alert("Save failed. Please try again.");
    setTeam((prev) => prev ? { ...prev, chairman: data } : prev);
    setEditingChairman(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>Loading…</div>;

  if (editing) {
    return (
      <div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
          <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: "none", border: "none", color: "rgba(250,246,238,0.5)", cursor: "pointer", fontSize: "18px" }}>←</button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>{isNew ? "Add Member" : "Edit Member"}</h1>
        </div>
        <MemberForm member={editing.member} onSave={saveMember} onCancel={() => { setEditing(null); setIsNew(false); }} />
      </div>
    );
  }

  if (editingChairman && team) {
    return (
      <div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
          <button onClick={() => setEditingChairman(false)} style={{ background: "none", border: "none", color: "rgba(250,246,238,0.5)", cursor: "pointer", fontSize: "18px" }}>←</button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>Edit Chairman</h1>
        </div>
        <ChairmanForm chairman={team.chairman} onSave={saveChairman} onCancel={() => setEditingChairman(false)} />
      </div>
    );
  }

  const MemberSection = ({ title, members, section }: { title: string; members: TeamMember[]; section: Section }) => (
    <div style={{ marginBottom: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)" }}>{title}</h2>
        <button onClick={() => { setEditing({ member: { id: "", name: "", role: "", imageUrl: "" }, section }); setIsNew(true); }}
          style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "6px 14px", color: "var(--royal-gold)", fontSize: "12px", cursor: "pointer" }}>
          + Add
        </button>
      </div>
      {members.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px", color: "rgba(250,246,238,0.3)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "12px" }}>No members yet.</div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "12px", overflow: "hidden" }}>
          {members.map((m, i) => (
            <div key={m.id} style={{
              display: "grid", gridTemplateColumns: "48px 1fr auto", gap: "16px", alignItems: "center",
              padding: "14px 20px",
              borderBottom: i < members.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none"
            }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(139,26,26,0.2)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {m.imageUrl
                  ? <img src={m.imageUrl} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: "18px" }}>👤</span>
                }
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>{m.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(250,246,238,0.4)" }}>{m.role}</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setEditing({ member: m, section }); setIsNew(false); }} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "5px 12px", color: "var(--royal-gold)", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => removeMember(m.id, section)} style={{ background: "rgba(139,26,26,0.15)", border: "1px solid rgba(139,26,26,0.25)", borderRadius: "6px", padding: "5px 12px", color: "#e07070", fontSize: "12px", cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, marginBottom: "28px" }}>Team Members</h1>

      {error && (
        <div style={{ padding: "16px", background: "rgba(139,26,26,0.15)", border: "1px solid rgba(139,26,26,0.3)", borderRadius: "8px", color: "#e07070", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Chairman card */}
      {team && (
        <div style={{ background: "rgba(139,26,26,0.08)", border: "1px solid rgba(139,26,26,0.2)", borderRadius: "12px", padding: "20px", marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(139,26,26,0.3)", border: "2px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {team.chairman.imageUrl
                ? <img src={team.chairman.imageUrl} alt={team.chairman.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: "20px" }}>👑</span>
              }
            </div>
            <div>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "3px" }}>Chairman</div>
              <div style={{ fontSize: "15px", fontWeight: 600 }}>{team.chairman.name || "—"}</div>
              <div style={{ fontSize: "12px", color: "rgba(250,246,238,0.45)" }}>{team.chairman.title}</div>
            </div>
          </div>
          <button onClick={() => setEditingChairman(true)} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "7px 16px", color: "var(--royal-gold)", fontSize: "12px", cursor: "pointer" }}>Edit Chairman</button>
        </div>
      )}

      {team && (
        <>
          <MemberSection title="Board of Directors" members={team.boardOfDirectors} section="board" />
          <MemberSection title="Top Management" members={team.topManagement} section="management" />
        </>
      )}
    </div>
  );
}

function MemberForm({ member, onSave, onCancel }: { member: TeamMember; onSave: (d: TeamMember) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState(member);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) { alert("Upload failed."); return; }
      const { path } = await res.json();
      setForm((f) => ({ ...f, imageUrl: path }));
    } catch {
      alert("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Name is required.");
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "32px", maxWidth: "480px" }}>
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input className="form-input" value={form.name} placeholder="Member's full name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Role / Designation *</label>
        <input className="form-input" value={form.role} placeholder="e.g. Chairman, Director" onChange={(e) => setForm({ ...form, role: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Photo</label>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(139,26,26,0.2)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            {form.imageUrl
              ? <img src={form.imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: "24px" }}>👤</span>
            }
          </div>
          <div>
            <label style={{ display: "inline-block", padding: "7px 14px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", fontSize: "12px", color: "var(--royal-gold)", cursor: "pointer" }}>
              {uploading ? "Uploading…" : "Upload Photo"}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} disabled={uploading} />
            </label>
            {form.imageUrl && (
              <button onClick={() => setForm({ ...form, imageUrl: "" })} style={{ marginLeft: "8px", background: "none", border: "none", color: "rgba(250,246,238,0.4)", cursor: "pointer", fontSize: "12px" }}>Remove</button>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button onClick={handleSave} disabled={saving || uploading} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving…" : "Save Member"}
        </button>
        <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
      </div>
    </div>
  );
}

function ChairmanForm({ chairman, onSave, onCancel }: { chairman: ChairmanData; onSave: (d: ChairmanData) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState(chairman);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) { alert("Upload failed."); return; }
      const { path } = await res.json();
      setForm((f) => ({ ...f, imageUrl: path }));
    } catch {
      alert("Upload error.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Name is required.");
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "32px", maxWidth: "560px" }}>
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Chairman" />
      </div>
      <div className="form-group">
        <label className="form-label">Chairman's Message</label>
        <textarea className="form-textarea" style={{ minHeight: "120px" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message from the chairman…" />
      </div>
      <div className="form-group">
        <label className="form-label">Photo</label>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(139,26,26,0.2)", border: "2px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            {form.imageUrl ? <img src={form.imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "28px" }}>👑</span>}
          </div>
          <label style={{ display: "inline-block", padding: "7px 14px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", fontSize: "12px", color: "var(--royal-gold)", cursor: "pointer" }}>
            {uploading ? "Uploading…" : "Upload Photo"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button onClick={handleSave} disabled={saving || uploading} className="btn btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving…" : "Save Chairman"}
        </button>
        <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
      </div>
    </div>
  );
}
