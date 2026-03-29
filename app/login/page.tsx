"use client";
import "../quiz/quiz.css";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message === "Invalid login credentials" ? "Invalid email or password. Please try again." : signInError.message);
    } else {
      router.push("/study");
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
        <a href="/signup" className="quiz-score-pill" style={{ textDecoration: "none" }}>Sign up</a>
      </nav>

      <div className="quiz-container" style={{ maxWidth: 440, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>Welcome back</h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0 }}>Log in to continue your study.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }} onKeyDown={handleKeyPress}>
          <div>
            <label style={{ fontSize: 13, color: "#6B7B8D", display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10,
                border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
                color: "#FFF", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#6B7B8D", display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10,
                border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
                color: "#FFF", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,107,74,0.1)", color: "#FF6B4A", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="quiz-btn quiz-btn-primary"
            style={{ width: "100%", marginTop: 4, opacity: loading ? 0.5 : 1 }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p style={{ fontSize: 13, color: "#4A5568", textAlign: "center", marginTop: 8 }}>
            Don&apos;t have an account? <a href="/signup" style={{ color: "#00D4AA", textDecoration: "none" }}>Sign up free</a>
          </p>
        </div>
      </div>
    </div>
  );
}
