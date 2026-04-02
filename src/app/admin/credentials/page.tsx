"use client";
// src/app/admin/credentials/page.tsx
import { useState, useEffect } from "react";

interface UserInfo {
  username: string;
  role: string;
}

export default function AdminCredentialsPage() {
  const [session, setSession] = useState<UserInfo | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Change own password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [ownMsg, setOwnMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [ownSaving, setOwnSaving] = useState(false);

  // Reset another user's password (admin only)
  const [targetUser, setTargetUser] = useState("");
  const [adminPwd, setAdminPwd] = useState("");
  const [resetPwd, setResetPwd] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetMsg, setResetMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [resetSaving, setResetSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session").then((r) => r.json()),
      fetch("/api/admin/credentials").then((r) => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([sess, userList]) => {
      if (sess.authenticated) setSession({ username: sess.username, role: sess.role });
      if (Array.isArray(userList)) setUsers(userList);
      setLoading(false);
    });
  }, []);

  const isAdmin = session?.role === "admin";
  const otherUsers = users.filter((u) => u.username !== session?.username);

  async function handleChangeOwn(e: React.FormEvent) {
    e.preventDefault();
    setOwnMsg(null);

    if (newPwd.length < 8) {
      setOwnMsg({ type: "err", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPwd !== confirmPwd) {
      setOwnMsg({ type: "err", text: "New passwords do not match." });
      return;
    }

    setOwnSaving(true);
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUsername: session!.username,
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOwnMsg({ type: "ok", text: "Password updated successfully." });
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else {
        setOwnMsg({ type: "err", text: data.error || "Failed to update password." });
      }
    } catch {
      setOwnMsg({ type: "err", text: "Network error. Please try again." });
    } finally {
      setOwnSaving(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetMsg(null);

    if (!targetUser) {
      setResetMsg({ type: "err", text: "Select a user to reset." });
      return;
    }
    if (resetPwd.length < 8) {
      setResetMsg({ type: "err", text: "New password must be at least 8 characters." });
      return;
    }
    if (resetPwd !== resetConfirm) {
      setResetMsg({ type: "err", text: "New passwords do not match." });
      return;
    }

    setResetSaving(true);
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUsername: targetUser,
          currentPassword: adminPwd,
          newPassword: resetPwd,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetMsg({ type: "ok", text: `Password for "${targetUser}" has been reset.` });
        setAdminPwd("");
        setResetPwd("");
        setResetConfirm("");
      } else {
        setResetMsg({ type: "err", text: data.error || "Failed to reset password." });
      }
    } catch {
      setResetMsg({ type: "err", text: "Network error. Please try again." });
    } finally {
      setResetSaving(false);
    }
  }

  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "rgba(250,246,238,0.3)" }}>Loading...</div>;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "8px",
    color: "#FAF6EE",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(250,246,238,0.5)",
    marginBottom: "6px",
    letterSpacing: "0.04em",
  };

  const btnStyle: React.CSSProperties = {
    padding: "10px 24px",
    background: "#8B1A1A",
    border: "1px solid rgba(201,168,76,0.3)",
    borderRadius: "8px",
    color: "#FAF6EE",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const msgBox = (msg: { type: "ok" | "err"; text: string } | null) => {
    if (!msg) return null;
    const isOk = msg.type === "ok";
    return (
      <div style={{
        padding: "12px 16px",
        background: isOk ? "rgba(26,139,26,0.15)" : "rgba(139,26,26,0.15)",
        border: `1px solid ${isOk ? "rgba(26,139,26,0.3)" : "rgba(139,26,26,0.3)"}`,
        borderRadius: "8px",
        color: isOk ? "#6ee06e" : "#F87171",
        fontSize: "13px",
        marginBottom: "16px",
      }}>
        {msg.text}
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>Credentials</h1>
        <p style={{ fontSize: "13px", color: "rgba(250,246,238,0.4)", marginTop: "4px" }}>Manage admin panel passwords</p>
      </div>

      {/* Section 1: Change own password */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "16px" }}>
          Change Your Password
        </h2>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "24px", maxWidth: "480px" }}>
          {msgBox(ownMsg)}
          <form onSubmit={handleChangeOwn}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                style={inputStyle}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                style={inputStyle}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <span style={{ fontSize: "11px", color: "rgba(250,246,238,0.3)", marginTop: "4px", display: "block" }}>Minimum 8 characters</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                style={inputStyle}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" style={{ ...btnStyle, opacity: ownSaving ? 0.7 : 1 }} disabled={ownSaving}>
              {ownSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Section 2: Reset another user (admin only) */}
      {isAdmin && otherUsers.length > 0 && (
        <div>
          <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--royal-gold)", marginBottom: "16px" }}>
            Reset User Password
          </h2>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "24px", maxWidth: "480px" }}>
            {msgBox(resetMsg)}
            <form onSubmit={handleReset}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Select User</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  required
                >
                  <option value="" style={{ background: "#0F0A04" }}>Choose a user...</option>
                  {otherUsers.map((u) => (
                    <option key={u.username} value={u.username} style={{ background: "#0F0A04" }}>
                      {u.username} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Your Password (confirm identity)</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={adminPwd}
                  onChange={(e) => setAdminPwd(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>New Password for {targetUser || "user"}</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={resetPwd}
                  onChange={(e) => setResetPwd(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Confirm New Password</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" style={{ ...btnStyle, opacity: resetSaving ? 0.7 : 1 }} disabled={resetSaving}>
                {resetSaving ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
