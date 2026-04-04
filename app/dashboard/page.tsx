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

// Common Australian aerodrome coordinates for Windy embed
const AERODROME_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  YSBK: { lat: -33.9244, lon: 150.9886, name: "Bankstown" },
  YSSY: { lat: -33.9461, lon: 151.1772, name: "Sydney Kingsford Smith" },
  YMML: { lat: -37.6733, lon: 144.8430, name: "Melbourne Tullamarine" },
  YBBN: { lat: -27.3842, lon: 153.1175, name: "Brisbane" },
  YPAD: { lat: -34.9450, lon: 138.5306, name: "Adelaide" },
  YPPH: { lat: -31.9403, lon: 115.9672, name: "Perth" },
  YSRI: { lat: -33.7003, lon: 150.9928, name: "Richmond RAAF" },
  YSCN: { lat: -34.0419, lon: 150.6872, name: "Camden" },
  YWOL: { lat: -34.5611, lon: 150.7892, name: "Wollongong/Albion Park" },
  YCFS: { lat: -30.3206, lon: 153.1161, name: "Coffs Harbour" },
  YBTH: { lat: -33.4094, lon: 149.6517, name: "Bathurst" },
  YMAV: { lat: -38.0394, lon: 144.4694, name: "Avalon" },
  YMEN: { lat: -37.7281, lon: 144.9017, name: "Essendon" },
  YMPC: { lat: -38.3339, lon: 145.0486, name: "Moorabbin" },
  YCDR: { lat: -26.0739, lon: 152.3811, name: "Caloundra" },
  YAMB: { lat: -34.0258, lon: 151.6331, name: "Archerfield" },
  YBAF: { lat: -27.5703, lon: 153.0078, name: "Archerfield" },
  YTWB: { lat: -27.5428, lon: 151.9164, name: "Toowoomba" },
  YBCS: { lat: -16.8858, lon: 145.7553, name: "Cairns" },
  YBTL: { lat: -19.2525, lon: 146.7656, name: "Townsville" },
  YPJT: { lat: -31.9364, lon: 115.8814, name: "Jandakot" },
  YMMB: { lat: -37.9758, lon: 145.1025, name: "Moorabbin" },
};

function WeatherWidget({ icao, lat, lon, onChangeIcao }: { icao: string; lat: number; lon: number; onChangeIcao: () => void }) {
  const [metar, setMetar] = useState<string>("");
  const [taf, setTaf] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true); setError("");
      // Fetch METAR and TAF independently
      try {
        const metarRes = await fetch(`/api/weather?icao=${icao}&type=metar`);
        if (metarRes.ok) {
          const json = await metarRes.json();
          setMetar(json.data || "No METAR available for this station");
        } else {
          setMetar("No METAR available for this station");
        }
      } catch {
        setMetar("Could not load METAR");
      }
      try {
        const tafRes = await fetch(`/api/weather?icao=${icao}&type=taf`);
        if (tafRes.ok) {
          const json = await tafRes.json();
          setTaf(json.data || "No TAF available for this station");
        } else {
          setTaf("No TAF available for this station");
        }
      } catch {
        setTaf("Could not load TAF");
      }
      setLoading(false);
    }
    if (icao) fetchWeather();
  }, [icao]);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: 0 }}>
          Weather — {icao}
        </h3>
        <button onClick={onChangeIcao} style={{ fontSize: 12, color: "#4A5568", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans', sans-serif" }}>
          Change aerodrome
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "20px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#6B7B8D", margin: 0 }}>Loading weather...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "20px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#E96B56", margin: 0 }}>{error}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* METAR */}
          <div style={{ padding: "14px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#00D4AA", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>METAR</div>
            <pre style={{ fontSize: 13, color: "#CCD6E0", margin: 0, fontFamily: "'DM Mono', 'SF Mono', 'Consolas', monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.5 }}>
              {metar || "No METAR available for this station"}
            </pre>
          </div>
          {/* TAF */}
          <div style={{ padding: "14px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#5D9CEC", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>TAF</div>
            <pre style={{ fontSize: 13, color: "#CCD6E0", margin: 0, fontFamily: "'DM Mono', 'SF Mono', 'Consolas', monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.5 }}>
              {taf || "No TAF available for this station"}
            </pre>
          </div>
        </div>
      )}

      {/* Windy embed */}
      <div style={{ marginTop: 12, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
        <iframe
          src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=kt&zoom=8&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}&pressure=true&message=true`}
          width="100%"
          height="300"
          style={{ border: "none", display: "block" }}
          loading="lazy"
          title="Windy weather radar"
        />
      </div>
    </div>
  );
}

function IcaoSetup({ onSave }: { onSave: (icao: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const clean = input.trim().toUpperCase();
    if (clean.length !== 4) { setError("ICAO codes are 4 characters (e.g. YSBK)"); return; }
    if (!/^[A-Z]{4}$/.test(clean)) { setError("ICAO codes are 4 letters only"); return; }
    onSave(clean);
  };

  return (
    <div style={{ marginBottom: 24, padding: "24px 20px", borderRadius: 14, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 6px" }}>
        Set your home aerodrome
      </h3>
      <p style={{ fontSize: 13, color: "#6B7B8D", margin: "0 0 16px", lineHeight: 1.5 }}>
        Enter your home aerodrome ICAO code to see live METAR, TAF, and weather radar on your dashboard.
      </p>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value.toUpperCase()); setError(""); }}
          placeholder="e.g. YSBK"
          maxLength={4}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)", background: "#0F1D2F",
            color: "#FFF", fontSize: 15, fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "0.1em", textTransform: "uppercase", outline: "none",
          }}
          onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
        />
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: "#00D4AA", color: "#0F1D2F", fontSize: 14,
            fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Save
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: "#E96B56", margin: "8px 0 0" }}>{error}</p>}
      <p style={{ fontSize: 11, color: "#4A5568", margin: "10px 0 0" }}>
        Common: YSBK (Bankstown), YSSY (Sydney), YMML (Melbourne), YBBN (Brisbane), YBTH (Bathurst)
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [tier, setTier] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [homeIcao, setHomeIcao] = useState<string | null>(null);
  const [homeLat, setHomeLat] = useState<number>(-33.9244);
  const [homeLon, setHomeLon] = useState<number>(150.9886);
  const [showIcaoSetup, setShowIcaoSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/login");
      setUser(session.user);
      setFirstName(session.user.user_metadata?.first_name || "");

      const { data: profile } = await supabase.from("profiles").select("tier, access_expires_at, home_icao, home_lat, home_lon").eq("id", session.user.id).single();
      if (profile) {
        setTier(profile.tier || "");
        if (profile.access_expires_at) {
          setExpiresAt(new Date(profile.access_expires_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }));
        }
        if (profile.home_icao) {
          setHomeIcao(profile.home_icao);
          setHomeLat(profile.home_lat || -33.9244);
          setHomeLon(profile.home_lon || 150.9886);
        }
      }

      setLoading(false);
    }
    init();
  }, [router]);

  const handleSaveIcao = async (icao: string) => {
    const coords = AERODROME_COORDS[icao] || null;
    const lat = coords ? coords.lat : -33.9;
    const lon = coords ? coords.lon : 151.2;

    // Save to profile
    if (user) {
      await supabase.from("profiles").update({ home_icao: icao, home_lat: lat, home_lon: lon }).eq("id", user.id);
    }

    setHomeIcao(icao);
    setHomeLat(lat);
    setHomeLon(lon);
    setShowIcaoSetup(false);
  };

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
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />

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
          <DashCard
            href="/resources" accent="#8E6AC8"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><line x1="9" y1="7" x2="16" y2="7" /><line x1="9" y1="11" x2="14" y2="11" /></svg>}
            title="Resources" desc="Study guides, reference cards, and tools from CASA, BOM, and Airservices."
          />
          <ShareButton />
        </div>

        {/* Weather section */}
        {homeIcao && !showIcaoSetup ? (
          <WeatherWidget icao={homeIcao} lat={homeLat} lon={homeLon} onChangeIcao={() => setShowIcaoSetup(true)} />
        ) : (
          <IcaoSetup onSave={handleSaveIcao} />
        )}

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
