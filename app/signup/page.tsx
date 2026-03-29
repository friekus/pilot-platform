"use client";
import "../quiz/quiz.css";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!email || !password || !firstName) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
        <a href="/login" className="quiz-score-pill" style={{ textDecoration: "none" }}>Log in</a>
      </nav>

      <div className="quiz-container" style={{ maxWidth: 440, margin: "0 auto", padding: "48px 24px" }}>
        {success ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,212,170,0.12)", color: "#00D4AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, margin: "0 auto 20px" }}>{"\u2713"}</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 12px" }}>You&apos;re in!</h2>
            <p style={{ fontSize: 15, color: "#8899AA", lineHeight: 1.6, margin: "0 0 24px" }}>Your account has been created. Start practising now.</p>
            <a href="/study" className="quiz-btn quiz-btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Start a quiz</a>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>Create your account</h1>
              <p style={{ fontSize: 15, color: "#8899AA", margin: 0 }}>Start practising for your RPL, PPL, or CPL exams.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: "#6B7B8D", display: "block", marginBottom: 6 }}>First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 10,
                    border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
                    color: "#FFF", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
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
                  placeholder="At least 6 characters"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 10,
                    border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
                    color: "#FFF", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#6B7B8D", display: "block", marginBottom: 6 }}>Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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
                onClick={handleSignup}
                disabled={loading}
                className="quiz-btn quiz-btn-primary"
                style={{ width: "100%", marginTop: 4, opacity: loading ? 0.5 : 1 }}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p style={{ fontSize: 13, color: "#4A5568", textAlign: "center", marginTop: 8 }}>
                Already have an account? <a href="/login" style={{ color: "#00D4AA", textDecoration: "none" }}>Log in</a>
              </p>
              <p style={{ fontSize: 11, color: "#4A5568", textAlign: "center", marginTop: 4 }}>
                By creating an account, you agree to our <a href="/terms" style={{ color: "#4A5568", textDecoration: "underline" }}>Terms</a> and <a href="/privacy" style={{ color: "#4A5568", textDecoration: "underline" }}>Privacy Policy</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
