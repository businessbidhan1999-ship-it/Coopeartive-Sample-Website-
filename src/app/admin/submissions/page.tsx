"use client";
// src/app/admin/submissions/page.tsx
// Admin page: view and update status of Apply + Contact form submissions.
import { useState, useEffect, useCallback } from "react";

interface Application {
  id: string;
  submittedAt: string;
  status: "new" | "reviewed" | "contacted";
  name: string;
  phone: string;
  email: string;
  product: string;
  message: string;
}

interface ContactMessage {
  id: string;
  submittedAt: string;
  status: "new" | "reviewed" | "replied";
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

type Tab = "applications" | "contacts";

const STATUS_COLORS: Record<string, string> = {
  new: "rgba(201,168,76,0.15)",
  reviewed: "rgba(100,160,100,0.15)",
  contacted: "rgba(100,140,200,0.15)",
  replied: "rgba(100,140,200,0.15)",
};

const STATUS_TEXT: Record<string, string> = {
  new: "#c9a84c",
  reviewed: "#7bc97b",
  contacted: "#7baee0",
  replied: "#7baee0",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" });
}

export default function SubmissionsPage() {
  const [tab, setTab] = useState<Tab>("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchData = useCallback(async (type: Tab) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/submissions?type=${type}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      if (type === "applications") setApplications(data);
      else setContacts(data);
    } catch {
      setError("Could not load submissions. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(tab);
  }, [tab, fetchData]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/submissions?type=${tab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      if (tab === "applications") {
        setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: status as Application["status"] } : a));
      } else {
        setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status: status as ContactMessage["status"] } : c));
      }
    } catch {
      alert("Status update failed.");
    } finally {
      setUpdating(null);
    }
  };

  const items = tab === "applications" ? applications : contacts;
  const appStatuses = ["new", "reviewed", "contacted"];
  const contactStatuses = ["new", "reviewed", "replied"];
  const statuses = tab === "applications" ? appStatuses : contactStatuses;

  const newCount = (arr: { status: string }[]) => arr.filter((i) => i.status === "new").length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>Form Submissions</h1>
        <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.4)", marginTop: "4px" }}>
          Review and manage incoming applications and contact messages.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {(["applications", "contacts"] as Tab[]).map((t) => {
          const count = newCount(t === "applications" ? applications : contacts);
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                border: active ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(201,168,76,0.12)",
                background: active ? "rgba(201,168,76,0.12)" : "transparent",
                color: active ? "var(--royal-gold)" : "rgba(250,246,238,0.5)",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              {t === "applications" ? "Applications" : "Contact Messages"}
              {count > 0 && (
                <span style={{ background: "#c9a84c", color: "#1a1207", borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: 700 }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>Loading…</div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#e07070" }}>{error}</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>
          No {tab === "applications" ? "applications" : "messages"} yet.
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "12px", overflow: "hidden" }}>
          {items.map((item, i) => {
            const isOpen = expanded === item.id;
            const app = item as Application;
            const msg = item as ContactMessage;
            return (
              <div key={item.id} style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none" }}>
                {/* Row */}
                <div
                  style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "16px", alignItems: "center", padding: "14px 20px", cursor: "pointer" }}
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "3px" }}>
                      {item.name}
                      {tab === "applications" && app.product && (
                        <span style={{ marginLeft: "10px", fontSize: "11px", fontWeight: 400, color: "rgba(250,246,238,0.4)" }}>
                          → {app.product}
                        </span>
                      )}
                      {tab === "contacts" && msg.subject && (
                        <span style={{ marginLeft: "10px", fontSize: "11px", fontWeight: 400, color: "rgba(250,246,238,0.4)" }}>
                          — {msg.subject}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(250,246,238,0.35)", display: "flex", gap: "12px" }}>
                      <span>{formatDate(item.submittedAt)}</span>
                      <span>{item.phone}</span>
                      {item.email && <span>{item.email}</span>}
                    </div>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px",
                    background: STATUS_COLORS[item.status] ?? "rgba(201,168,76,0.08)",
                    color: STATUS_TEXT[item.status] ?? "rgba(250,246,238,0.5)",
                    textTransform: "capitalize",
                  }}>
                    {item.status}
                  </span>
                  <span style={{ fontSize: "12px", color: "rgba(250,246,238,0.25)" }}>{isOpen ? "▲" : "▼"}</span>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(201,168,76,0.06)" }}>
                    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "16px", marginTop: "12px", marginBottom: "16px", fontSize: "13px", color: "rgba(250,246,238,0.65)", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                      {item.message || <em style={{ color: "rgba(250,246,238,0.25)" }}>No message provided.</em>}
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "rgba(250,246,238,0.35)", marginRight: "4px" }}>Update status:</span>
                      {statuses.map((s) => (
                        <button
                          key={s}
                          disabled={item.status === s || updating === item.id}
                          onClick={() => updateStatus(item.id, s)}
                          style={{
                            padding: "5px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: item.status === s ? "default" : "pointer",
                            border: item.status === s ? `1px solid ${STATUS_TEXT[s]}` : "1px solid rgba(201,168,76,0.15)",
                            background: item.status === s ? (STATUS_COLORS[s] ?? "transparent") : "transparent",
                            color: item.status === s ? STATUS_TEXT[s] : "rgba(250,246,238,0.4)",
                            textTransform: "capitalize",
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
