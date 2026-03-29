"use client";
import "../quiz/quiz.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

const levels = [
  { slug: "rpl", name: "RPL", full: "Recreational Pilot Licence", desc: "The first step. Covers basic aerodynamics, air law, meteorology, human factors, navigation, performance, and systems.", color: "#00D4AA", subjects: 7, questions: "110+" },
  { slug: "ppl", name: "PPL", full: "Private Pilot Licence", desc: "Building on RPL knowledge with deeper theory across all subjects plus operations, performance, and planning.", color: "#5D9CEC", subjects: 7, questions: "Coming soon" },
  { slug: "cpl", name: "CPL", full: "Commercial Pilot Licence", desc: "Advanced aerodynamics, complex air law, detailed meteorology, and commercial operations knowledge.", color: "#F6BB42", subjects: 7, questions: "Coming soon" },
  { slug: "irex", name: "IREX", full: "Instrument Rating Exam", desc: "Instrument flight rules, procedures, navigation, and meteorology for the instrument rating.", color: "#E96B56", subjects: 1, questions: "Coming soon" },
];

export default function StudyPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      setFirstName(session.user.user_metadata?.first_name || "");
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="quiz-root">
        <div className="quiz-container"><div className="quiz-loading"><div className="quiz-spinner" /><p>Loading...</p></div></div>
      </div>
    );
  }

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link">
          <Logo size={34} />
          <span className="quiz-logo-text">Vectored</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#6B7B8D" }}>{firstName || user?.email}</span>
          <button onClick={handleLogout} style={{
            padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent", color: "#6B7B8D", fontSize: 12, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>Log out</button>
        </div>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>
            {firstName ? `Hey ${firstName}, what are you studying?` : "What are you studying?"}
          </h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            Choose your licence level. All questions are aligned to the Part 61 MOS Schedule 3.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {levels.map(l => {
            const isAvailable = l.slug === "rpl";
            return (
              <a
                key={l.slug}
                href={isAvailable ? `/study/${l.slug}` : undefined}
                onClick={e => { if (!isAvailable) e.preventDefault(); }}
                className="subject-card"
                style={{
                  textDecoration: "none",
                  opacity: isAvailable ? 1 : 0.5,
                  cursor: isAvailable ? "pointer" : "default",
                }}
              >
                <div className="subject-icon" style={{
                  background: `${l.color}15`, color: l.color,
                  fontWeight: 700, fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  {l.name}
                </div>
                <div className="subject-info">
                  <div className="subject-name">{l.full}</div>
                  <div className="subject-desc">{l.desc}</div>
                </div>
                <div className="subject-meta">
                  <span className="subject-count">
                    {isAvailable ? `${l.subjects} subjects` : l.questions}
                  </span>
                  <span className="subject-arrow">{isAvailable ? "→" : ""}</span>
                </div>
              </a>
            );
          })}
        </div>

        <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            Questions aligned to Part 61 MOS Schedule 3. Vectored is a study aid — not affiliated with CASA.
            <br />
            <a href="/terms" style={{ color: "#4A5568", textDecoration: "underline" }}>Terms</a>
            {" · "}
            <a href="/privacy" style={{ color: "#4A5568", textDecoration: "underline" }}>Privacy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
