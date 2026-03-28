"use client";
import "./quiz.css";
import { useEffect, useState } from "react";

const SUPABASE_URL = "https://cbvzjovbheiavmkalmaz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidnpqb3ZiaGVpYXZta2FsbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDA2MDUsImV4cCI6MjA4OTkxNjYwNX0.elpc_IUb9dot2ljnFMXGQnWAQ1aAb8krb2-QxC2jnKw";

type SubjectCount = { subject: string; count: number };

const subjectMeta: Record<string, { icon: string; description: string; color: string }> = {
  "Aerodynamics": { icon: "✈", description: "Lift, drag, stalling, controls, stability, and flight principles", color: "#00D4AA" },
  "Air Law": { icon: "§", description: "Flight rules, licence privileges, airspace, aerodromes, and regulations", color: "#5D9CEC" },
  "Meteorology": { icon: "☁", description: "Weather hazards, forecasts, turbulence, and wind effects on flight", color: "#F6BB42" },
  "Human Factors": { icon: "♦", description: "Fitness to fly, hypoxia, spatial disorientation, fatigue, and decision making", color: "#E96B56" },
  "Navigation": { icon: "◎", description: "Charts, altimetry, speed definitions, time, and position fixing", color: "#8E6AC8" },
  "Performance": { icon: "▲", description: "Density altitude, takeoff/landing factors, weight and balance, V-speeds", color: "#48B0A2" },
  "Systems": { icon: "⚙", description: "Engine systems, carburettor ice, instruments, and aircraft components", color: "#D4A05A" },
};

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

export default function QuizSelectPage() {
  const [subjects, setSubjects] = useState<SubjectCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/questions?level=eq.RPL&select=subject`,
          { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
        );
        const data: { subject: string }[] = await res.json();
        const counts: Record<string, number> = {};
        data.forEach(d => { counts[d.subject] = (counts[d.subject] || 0) + 1; });
        const sorted = Object.entries(counts)
          .map(([subject, count]) => ({ subject, count }))
          .sort((a, b) => b.count - a.count);
        setSubjects(sorted);
      } catch {
        // fallback
      }
      setLoading(false);
    }
    fetchCounts();
  }, []);

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

      <nav className="quiz-nav">
        <a href="/" className="quiz-logo-link">
          <Logo size={34} />
          <span className="quiz-logo-text">Vectored</span>
        </a>
        <span className="quiz-score-pill">RPL Exam Prep</span>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>Choose your subject</h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            10 random questions per quiz, pulled from our Part 61 MOS-aligned question bank. Pick a subject and test your knowledge.
          </p>
        </div>

        {loading ? (
          <div className="quiz-loading">
            <div className="quiz-spinner" />
            <p>Loading subjects...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {subjects.map(s => {
              const meta = subjectMeta[s.subject] || { icon: "•", description: "", color: "#00D4AA" };
              return (
                <a
                  key={s.subject}
                  href={`/quiz/${encodeURIComponent(s.subject.toLowerCase().replace(/ /g, '-'))}`}
                  className="subject-card"
                  style={{ textDecoration: "none" }}
                >
                  <div className="subject-icon" style={{ background: `${meta.color}15`, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div className="subject-info">
                    <div className="subject-name">{s.subject}</div>
                    <div className="subject-desc">{meta.description}</div>
                  </div>
                  <div className="subject-meta">
                    <span className="subject-count">{s.count} questions</span>
                    <span className="subject-arrow">→</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            Vectored is a supplementary study aid. Not affiliated with or endorsed by CASA.
            <br />
            Questions are aligned to Part 61 MOS Schedule 3 but should not be your only study resource.
            <br />
            <a href="/terms" style={{ color: "#4A5568", textDecoration: "underline" }}>Terms of Use</a>
            {" · "}
            <a href="/privacy" style={{ color: "#4A5568", textDecoration: "underline" }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
