"use client";
import "../quiz/quiz.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

function DashCard({ href, icon, title, desc, accent }: { href: string; icon: React.ReactNode; title: string; desc: string; accent: string }) {
  return (
    <a href={href} className="dash-card" style={{ textDecoration: "none" }}>
      <div className="dash-card-icon" style={{ background: `${accent}12`, color: accent }}>{icon}</div>
      <div className="dash-card-content">
        <div className="dash-card-title">{title}</div>
        <div className="dash-card-desc">{desc}</div>
      </div>
      <div className="dash-card-arrow" style={{ color: accent }}>→</div>
    </a>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const shareText = "I've been using Vectored to study for my pilot exams — free RPL practice quiz with 100+ questions. Give it a go: https://vectored.com.au/try";
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Vectored - Aviation Quiz", text: shareText, url: "https://vectored.com.au/try" }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
    }
  };
  return (
    <button onClick={handleShare} className="dash-card" style={{ border: "1px solid rgba(246,187,66,0.15)", background: "rgba(246,187,66,0.03)", width: "100%", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="dash-card-icon" style={{ background: "#F6BB4212", color: "#F6BB42" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </div>
      <div className="dash-card-content">
        <div className="dash-card-title">{copied ? "Link copied!" : "Share with a mate"}</div>
        <div className="dash-card-desc">{copied ? "Paste it in a text, WhatsApp, or DM." : "Send the free RPL quiz to a friend who's studying or thinking about flying."}</div>
      </div>
      <div className="dash-card-arrow" style={{ color: "#F6BB42" }}>{copied ? "✓" : "→"}</div>
    </button>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [tier, setTier] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/login");
      setUser(session.user);
      setFirstName(session.user.user_metadata?.first_name || "");

      const { data: profile } = await supabase.from("profiles").select("tier, access_expires_at").eq("id", session.user.id).single();
      if (profile) {
        setTier(profile.tier || "");
        if (profile.access_expires_at) {
          setExpiresAt(new Date(profile.access_expires_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }));
        }
      }

      setLoading(false);
    }
    init();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="quiz-root">
        <div className="quiz-container">
          <div className="quiz-loading"><div className="quiz-spinner"></div><p>Loading...</p></div>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

      <nav className="quiz-nav">
        <a href="/dashboard" className="quiz-logo-link">
          <Logo size={34} />
          <span className="quiz-logo-text">Vectored</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#6B7B8D", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Log out
          </button>
        </div>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>
            {greeting}{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            Welcome to your Vectored dashboard. What would you like to do?
          </p>
        </div>

        {tier === "founding_pilot" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, marginBottom: 28, background: "rgba(0,212,170,0.04)", border: "1px solid rgba(0,212,170,0.12)", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(0,212,170,0.12)", fontSize: 12, fontWeight: 600, color: "#00D4AA" }}>Founding Pilot</div>
              <span style={{ fontSize: 13, color: "#6B7B8D" }}>Full access — free for 12 months</span>
            </div>
            {expiresAt && <span style={{ fontSize: 12, color: "#4A5568" }}>Expires {expiresAt}</span>}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          <DashCard
            href="/study" accent="#00D4AA"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>}
            title="Study hub" desc="Practice exams by licence level and subject. RPL, PPL, CPL, and IREX."
          />
          <DashCard
            href="/careers" accent="#5D9CEC"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>}
            title="Career hub" desc="Interactive operator map. See who's hiring and where the jobs are."
          />
          <ShareButton />
        </div>

        <div style={{ padding: "18px 20px", borderRadius: 14, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: "#FFF" }}>Got feedback?</strong> As a Founding Pilot, your input directly shapes Vectored. Spot an issue with a question? Use the flag button during any quiz. Got a suggestion for the platform? Email us at{" "}
            <a href="mailto:vectoredau@outlook.com" style={{ color: "#00D4AA", textDecoration: "none" }}>vectoredau@outlook.com</a>
          </p>
        </div>

        <div style={{ padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            <a href="/terms" style={{ color: "#4A5568", textDecoration: "underline" }}>Terms</a>
            {" · "}
            <a href="/privacy" style={{ color: "#4A5568", textDecoration: "underline" }}>Privacy</a>
            {" · "}
            <span>vectored.com.au</span>
          </p>
        </div>
      </div>
    </div>
  );
}
