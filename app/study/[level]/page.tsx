"use client";
import "../../quiz/quiz.css";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter, useParams } from "next/navigation";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

const SUPABASE_URL = "https://cbvzjovbheiavmkalmaz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidnpqb3ZiaGVpYXZta2FsbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDA2MDUsImV4cCI6MjA4OTkxNjYwNX0.elpc_IUb9dot2ljnFMXGQnWAQ1aAb8krb2-QxC2jnKw";

type SubjectCount = { subject: string; count: number };
type SubjectProgress = { uniqueAnswered: number; totalQuestions: number; correctCount: number; totalAnswered: number; };

const levelNames: Record<string, string> = {
  rpl: "RPL", ppl: "PPL", cpl: "CPL", irex: "IREX",
};
const levelFull: Record<string, string> = {
  rpl: "Recreational Pilot Licence", ppl: "Private Pilot Licence",
  cpl: "Commercial Pilot Licence", irex: "Instrument Rating Exam",
};

const subjectMeta: Record<string, { description: string; color: string }> = {
  "Aerodynamics": { description: "Lift, drag, stalling, controls, stability, and flight principles", color: "#00D4AA" },
  "Air Law": { description: "Flight rules, licence privileges, airspace, aerodromes, and regulations", color: "#5D9CEC" },
  "Meteorology": { description: "Weather hazards, forecasts, turbulence, and wind effects on flight", color: "#F6BB42" },
  "Human Factors": { description: "Fitness to fly, hypoxia, spatial disorientation, fatigue, and decision making", color: "#E96B56" },
  "Navigation": { description: "Charts, altimetry, speed definitions, time, and position fixing", color: "#8E6AC8" },
  "Performance": { description: "Density altitude, takeoff/landing factors, weight and balance, V-speeds", color: "#48B0A2" },
  "Systems": { description: "Engine systems, carburettor ice, instruments, and aircraft components", color: "#D4A05A" },
};

function getSubjectIcon(subject: string, color: string, size: number = 22) {
  switch (subject) {
    case "Aerodynamics":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M3 13.5L10 12.5L12 4L14 12.5L21 13.5L14 14L13 20H11L10 14L3 13.5Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
          <line x1="12" y1="9" x2="12" y2="5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 1.5" />
          <polygon points="12,4 11,6.5 13,6.5" fill={color} fillOpacity="0.5" />
        </svg>
      );
    case "Air Law":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="3" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="7" x2="20" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M4 7L6 13H2L4 7Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M20 7L22 13H18L20 7Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="8" y1="19" x2="16" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "Meteorology":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M6 16C3.79 16 2 14.21 2 12C2 10.14 3.28 8.59 5 8.14C5 5.29 7.29 3 10 3C12.04 3 13.78 4.37 14.47 6.27C14.96 6.1 15.47 6 16 6C18.76 6 21 8.24 21 11C21 13.76 18.76 16 16 16H6Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="9" y1="19" x2="8" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="19" x2="12" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="17" y1="19" x2="16" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "Human Factors":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
          <line x1="9" y1="21" x2="15" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "Navigation":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
          <polygon points="12,5 14,11 12,10 10,11" fill={color} />
          <polygon points="12,19 10,13 12,14 14,13" fill={color} fillOpacity="0.3" />
          <line x1="12" y1="2" x2="12" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="20" x2="12" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="12" x2="4" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "Performance":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
          <path d="M12 6V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 12H8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 12H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
          <line x1="12" y1="12" x2="15.5" y2="7.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "Systems":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
          <path d="M19.5,12.0 L19.3,13.9 L21.7,14.5 L20.6,17.1 L18.5,15.8 L17.3,17.3 L15.8,18.5 L17.1,20.6 L14.5,21.7 L13.9,19.3 L12.0,19.5 L10.1,19.3 L9.5,21.7 L6.9,20.6 L8.2,18.5 L6.7,17.3 L5.5,15.8 L3.4,17.1 L2.3,14.5 L4.7,13.9 L4.5,12.0 L4.7,10.1 L2.3,9.5 L3.4,6.9 L5.5,8.2 L6.7,6.7 L8.2,5.5 L6.9,3.4 L9.5,2.3 L10.1,4.7 L12.0,4.5 L13.9,4.7 L14.5,2.3 L17.1,3.4 L15.8,5.5 L17.3,6.7 L18.5,8.2 L20.6,6.9 L21.7,9.5 L19.3,10.1 Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
        </svg>
      );
  }
}

function ProgressRing({ pct, color, size = 36 }: { pct: number; color: string; size?: number }) {
  const r = (size - 4) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.5s ease" }} />
    </svg>
  );
}

export default function StudyLevelPage() {
  const params = useParams();
  const level = typeof params.level === "string" ? params.level : "";
  const levelName = levelNames[level] || level.toUpperCase();

  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectCount[]>([]);
  const [progress, setProgress] = useState<Record<string, SubjectProgress>>({});
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/login");
      setUser(session.user);
      setAccessToken(session.access_token);

      try {
        // Fetch question counts per subject
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/questions?level=eq.${levelName}&select=subject`,
          { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
        );
        const data: { subject: string }[] = await res.json();
        const counts: Record<string, number> = {};
        data.forEach(d => { counts[d.subject] = (counts[d.subject] || 0) + 1; });
        const sorted = Object.entries(counts)
          .map(([subject, count]) => ({ subject, count }))
          .sort((a, b) => b.count - a.count);
        setSubjects(sorted);

        // Fetch user progress from user_answers
        const progressRes = await fetch(
          `${SUPABASE_URL}/rest/v1/user_answers?user_id=eq.${session.user.id}&level=eq.${levelName}&select=subject,question_id,is_correct`,
          { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${session.access_token}` } }
        );
        const answers: { subject: string; question_id: number; is_correct: boolean }[] = await progressRes.json();

        if (answers && answers.length > 0) {
          const prog: Record<string, SubjectProgress> = {};
          answers.forEach(a => {
            if (!prog[a.subject]) prog[a.subject] = { uniqueAnswered: 0, totalQuestions: 0, correctCount: 0, totalAnswered: 0 };
            prog[a.subject].totalAnswered++;
            if (a.is_correct) prog[a.subject].correctCount++;
          });

          // Count unique questions per subject
          Object.keys(prog).forEach(subj => {
            const uniqueQIds = new Set(answers.filter(a => a.subject === subj).map(a => a.question_id));
            prog[subj].uniqueAnswered = uniqueQIds.size;
            prog[subj].totalQuestions = counts[subj] || 25;
          });

          setProgress(prog);
        }
      } catch { /* fallback */ }
      setLoading(false);
    }
    init();
  }, [router, levelName]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="quiz-root">
        <div className="quiz-container">
          <div className="quiz-loading">
            <div className="quiz-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

      <nav className="quiz-nav">
        <a href="/dashboard" className="quiz-logo-link">
          <Logo size={34} />
          <span className="quiz-logo-text">Vectored</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px", borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent", color: "#6B7B8D",
              fontSize: 12, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 8 }}>
          <a href="/study" style={{ fontSize: 13, color: "#4A5568", textDecoration: "none" }}>
            ← Study hub
          </a>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>
            {levelFull[level] || levelName} subjects
          </h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            {subjects.length > 0
              ? `${subjects.length} subjects available. 10 random questions per quiz, aligned to Part 61 MOS.`
              : "No questions available for this level yet. Check back soon."
            }
          </p>
        </div>

        {subjects.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {subjects.map(s => {
              const meta = subjectMeta[s.subject] || { description: "", color: "#00D4AA" };
              const prog = progress[s.subject];
              const completionPct = prog ? Math.round((prog.uniqueAnswered / prog.totalQuestions) * 100) : 0;
              const scorePct = prog && prog.totalAnswered > 0 ? Math.round((prog.correctCount / prog.totalAnswered) * 100) : -1;
              const scoreColor = scorePct >= 70 ? "#00D4AA" : scorePct >= 50 ? "#F6BB42" : scorePct >= 0 ? "#E96B56" : "rgba(255,255,255,0.06)";

              return (
                <a
                  key={s.subject}
                  href={`/study/${level}/${encodeURIComponent(s.subject.toLowerCase().replace(/ /g, "-"))}`}
                  className="subject-card"
                  style={{ textDecoration: "none" }}
                >
                  <div className="subject-icon" style={{ background: `${meta.color}15` }}>
                    {getSubjectIcon(s.subject, meta.color, 22)}
                  </div>
                  <div className="subject-info">
                    <div className="subject-name">{s.subject}</div>
                    <div className="subject-desc">{meta.description}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    {prog ? (
                      <div style={{ position: "relative", width: 36, height: 36 }}>
                        <ProgressRing pct={completionPct} color={scoreColor} size={36} />
                        <div style={{
                          position: "absolute", top: 0, left: 0, width: 36, height: 36,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700, color: scoreColor,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}>
                          {scorePct}%
                        </div>
                      </div>
                    ) : (
                      <div className="subject-meta">
                        <span className="subject-count">{s.count} Qs</span>
                        <span className="subject-arrow">→</span>
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Overall progress summary */}
        {Object.keys(progress).length > 0 && (() => {
          const totalAnswered = Object.values(progress).reduce((sum, p) => sum + p.totalAnswered, 0);
          const totalCorrect = Object.values(progress).reduce((sum, p) => sum + p.correctCount, 0);
          const avgScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
          const quizzesTaken = Math.max(1, Math.floor(totalAnswered / 10));
          const subjectsStudied = Object.keys(progress).length;

          // Find best and weakest
          let bestSubject = "";
          let bestScore = 0;
          let weakestSubject = "";
          let weakestScore = 100;
          Object.entries(progress).forEach(([subj, p]) => {
            if (p.totalAnswered > 0) {
              const pct = Math.round((p.correctCount / p.totalAnswered) * 100);
              if (pct >= bestScore) { bestSubject = subj; bestScore = pct; }
              if (pct <= weakestScore) { weakestSubject = subj; weakestScore = pct; }
            }
          });

          return (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 14px" }}>
                Your {levelFull[level] || levelName} progress
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div style={{ padding: "16px 14px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#FFF", fontFamily: "'Space Grotesk', sans-serif" }}>{totalAnswered}</div>
                  <div style={{ fontSize: 12, color: "#6B7B8D", marginTop: 4 }}>Questions answered</div>
                </div>
                <div style={{ padding: "16px 14px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: avgScore >= 70 ? "#00D4AA" : avgScore >= 50 ? "#F6BB42" : "#E96B56", fontFamily: "'Space Grotesk', sans-serif" }}>{avgScore}%</div>
                  <div style={{ fontSize: 12, color: "#6B7B8D", marginTop: 4 }}>Average score</div>
                </div>
                <div style={{ padding: "16px 14px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#FFF", fontFamily: "'Space Grotesk', sans-serif" }}>{subjectsStudied}/7</div>
                  <div style={{ fontSize: 12, color: "#6B7B8D", marginTop: 4 }}>Subjects studied</div>
                </div>
              </div>
              {bestSubject && weakestSubject && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 11, color: "#4A5568", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Strongest</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#00D4AA" }}>{bestSubject}</div>
                    <div style={{ fontSize: 12, color: "#6B7B8D", marginTop: 2 }}>{bestScore}% correct</div>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 11, color: "#4A5568", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Needs work</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#E96B56" }}>{weakestSubject}</div>
                    <div style={{ fontSize: 12, color: "#6B7B8D", marginTop: 2 }}>{weakestScore}% correct</div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            <a href="/terms" style={{ color: "#4A5568", textDecoration: "underline" }}>Terms</a>
            {" · "}
            <a href="/privacy" style={{ color: "#4A5568", textDecoration: "underline" }}>Privacy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
