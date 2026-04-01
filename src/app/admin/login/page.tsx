"use client";
// src/app/admin/login/page.tsx
import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label htmlFor="username" style={{ display: "block", fontSize: "13px", color: "rgba(250,246,238,0.6)", marginBottom: "6px" }}>
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: "8px",
            color: "#FAF6EE",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(201,168,76,0.5)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(201,168,76,0.2)"}
        />
      </div>

      <div>
        <label htmlFor="password" style={{ display: "block", fontSize: "13px", color: "rgba(250,246,238,0.6)", marginBottom: "6px" }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: "8px",
            color: "#FAF6EE",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(201,168,76,0.5)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(201,168,76,0.2)"}
        />
      </div>

      {error && (
        <div style={{
          padding: "10px 14px",
          background: "rgba(139,26,26,0.2)",
          border: "1px solid rgba(139,26,26,0.4)",
          borderRadius: "8px",
          color: "#F87171",
          fontSize: "13px",
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: loading ? "rgba(139,26,26,0.5)" : "#8B1A1A",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: "8px",
          color: "#FAF6EE",
          fontSize: "14px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "4px",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#080504",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#0F0A04",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: "12px",
        padding: "40px 32px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px", height: "56px",
            background: "#8B1A1A",
            border: "2px solid #C9A84C",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: 700,
            color: "#C9A84C",
            margin: "0 auto 16px",
            fontFamily: "Georgia, serif",
          }}>R</div>
          <h1 style={{ color: "#FAF6EE", fontSize: "20px", fontWeight: 600, margin: 0 }}>
            RMCL Admin
          </h1>
          <p style={{ color: "rgba(250,246,238,0.4)", fontSize: "13px", marginTop: "6px" }}>
            Sign in to manage your website
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "rgba(250,246,238,0.25)" }}>
          Royal Multipurpose Cooperative Society Ltd.
        </p>
      </div>
    </div>
  );
}
