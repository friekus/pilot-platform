"use client";
import "../quiz/quiz.css";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

const TOTAL_SPOTS = 25;

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [countLoaded, setCountLoaded] = useState(false);

  useEffect(() => {
    async function fetchCount() {
      setUserCount(1);
      setCountLoaded(true);
    }
    fetchCount();
  }, []);

  const spotsLeft = Math.max(0, TOTAL_SPOTS - userCount);
  const spotsFilled = userCount >= TOTAL_SPOTS;

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
            <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 4px" }}>Welcome aboard, Founding Pilot.</h2>
            <p style={{ fontSize: 15, color: "#8899AA", lineHeight: 1.6, margin: "8px 0 8px" }}>You have <strong style={{ color: "#00D4AA" }}>12 months of free access</strong> to the full Vectored study hub.</p>
            <p style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.6, margin: "0 0 28px" }}>All we ask: try the quizzes, tell us what you think, and share Vectored with a mate who&apos;s studying.</p>
            <a href="/study" className="quiz-btn quiz-btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Enter the study hub</a>
          </div>
        ) : (
          <>
            {/* Founding Pilot badge */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                display: "inline-block", padding: "6px 16px", borderRadius: 100,
                background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)",
                fontSize: 13, fontWeight: 600, color: "#00D4AA", marginBottom: 16,
              }}>
                Founding Pilot Program
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>
                {spotsFilled ? "Join the waitlist" : "Get 12 months free"}
              </h1>
              <p style={{ fontSize: 15, color: "#8899AA", margin: "0 0 0", lineHeight: 1.6 }}>
                {spotsFilled
                  ? "All Founding Pilot spots have been claimed. Join the waitlist and we\u2019ll let you know when we launch."
                  : "Be one of the first 25 pilots on Vectored. Full access to every subject, every level \u2014 free for 12 months."
                }
              </p>
            </div>

            {/* Spots counter */}
            {countLoaded && !spotsFilled && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7B8D", marginBottom: 6 }}>
                  <span>{userCount} of {TOTAL_SPOTS} claimed</span>
                  <span style={{ color: spotsLeft <= 5 ? "#FF6B4A" : "#00D4AA", fontWeight: 600 }}>{spotsLeft} spots left</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    background: spotsLeft <= 5 ? "#FF6B4A" : "#00D4AA",
                    width: `${(userCount / TOTAL_SPOTS) * 100}%`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            )}

            {/* What you get */}
            {!spotsFilled && (
              <div style={{
                padding: "14px 18px", borderRadius: 12, marginBottom: 24,
                background: "rgba(0,212,170,0.04)", border: "1px solid rgba(0,212,170,0.1)",
              }}>
                <p style={{ fontSize: 13, color: "#8899AA", margin: 0, lineHeight: 1.7 }}>
                  <strong style={{ color: "#00D4AA" }}>Founding Pilots get: </strong> Full access to RPL, PPL, CPL &amp; IREX question banks across all subjects. Topic-by-topic performance tracking. All future features for 12 months — free.
                </p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: "#6B7B8D", display: "block", marginBottom: 6 }}>First name</label>
                <input
                  type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
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
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
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
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
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
                  type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
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
                onClick={handleSignup} disabled={loading}
                className="quiz-btn quiz-btn-primary"
                style={{ width: "100%", marginTop: 4, opacity: loading ? 0.5 : 1 }}
              >
                {loading ? "Creating account..." : spotsFilled ? "Join the waitlist" : "Claim your Founding Pilot spot"}
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
