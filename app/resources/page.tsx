"use client";
import "../quiz/quiz.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

type Resource = {
  title: string;
  description: string;
  url: string;
  source: string;
};

type ToolItem = {
  title: string;
  description: string;
  href: string;
  accent: string;
  icon: React.ReactNode;
  available: boolean;
};

const resourcesBySubject: Record<string, { color: string; resources: Resource[] }> = {
  "Meteorology": {
    color: "#F6BB42",
    resources: [
      { title: "BOM Aviation Knowledge Centre", description: "Official BOM guides on TAFs, METARs, GAFs, weather hazards, and aviation forecasting.", url: "https://www.bom.gov.au/aviation/knowledge-centre/", source: "Bureau of Meteorology" },
      { title: "TAF & METAR Reference Card", description: "Quick reference card for decoding TAF and METAR reports — covers all codes, abbreviations, and formats.", url: "https://www.bom.gov.au/aviation/data/education/taf-metar-speci-reference-card.pdf", source: "Bureau of Meteorology" },
      { title: "Graphical Area Forecast (GAF)", description: "Live GAFs showing cloud, visibility, turbulence, and icing forecasts across Australia.", url: "https://www.bom.gov.au/aviation/gaf/gaf.shtml", source: "Bureau of Meteorology" },
      { title: "Aerodrome Forecasts (TAF)", description: "Search and view current TAFs for any Australian aerodrome by ICAO code or name.", url: "https://www.bom.gov.au/aviation/forecasts/taf/", source: "Bureau of Meteorology" },
      { title: "Weather Packages", description: "Complete weather briefing packages by aerodrome — includes MSLP charts, satellite, GAF, TAF, METAR, and Area QNH.", url: "https://www.bom.gov.au/aviation/weather-packages/", source: "Bureau of Meteorology" },
    ],
  },
  "Air Law": {
    color: "#5D9CEC",
    resources: [
      { title: "Visual Flight Rules Guide (VFRG)", description: "The essential reference for VFR operations in Australia — airspace, right of way, minima, and procedures.", url: "https://www.casa.gov.au/resources-and-education/publications-and-resources/visual-flight-rules-guide", source: "CASA" },
      { title: "Part 91 Plain English Guide", description: "Plain English explanation of the General Operating and Flight Rules regulations under CASR Part 91.", url: "https://www.casa.gov.au/resources-and-education/publications-and-resources/plain-english-guide-part-91", source: "CASA" },
      { title: "Part 61 Guide — Aeroplane Category", description: "Guide to flight crew licensing requirements — RPL, PPL, CPL privileges, limitations, and recency.", url: "https://www.casa.gov.au/resources-and-education/publications-and-resources/part-61-guide-aeroplane-category", source: "CASA" },
      { title: "AIP Australia — Airservices", description: "The official Aeronautical Information Publication — ENR, AD, and GEN sections for Australian airspace.", url: "https://www.airservicesaustralia.com/aip/aip.asp", source: "Airservices Australia" },
      { title: "NAIPS — Flight Planning", description: "National Aeronautical Information Processing System for NOTAMs, weather briefings, and flight plans.", url: "https://www.airservicesaustralia.com/naips/", source: "Airservices Australia" },
    ],
  },
  "Aerodynamics": {
    color: "#00D4AA",
    resources: [
      { title: "CASA Pilot Safety Hub", description: "Safety bulletins, accident summaries, and educational resources for Australian pilots.", url: "https://www.casa.gov.au/resources-and-education/pilot-safety-hub", source: "CASA" },
      { title: "RPL/PPL/CPL Workbook", description: "Official CASA study workbook covering aerodynamics, performance, and all BAK subjects.", url: "https://www.casa.gov.au/resources-and-education/publications-and-resources/flight-training/rpl-ppl-cpl-aeroplane-workbook", source: "CASA" },
      { title: "ATSB Safety Reports", description: "Aviation accident and incident investigation reports — real-world case studies for learning.", url: "https://www.atsb.gov.au/publications/investigation_reports", source: "ATSB" },
    ],
  },
  "Human Factors": {
    color: "#E96B56",
    resources: [
      { title: "CASA Safety Behaviours — Human Factors", description: "CASA's resource booklets covering threat and error management, decision making, and crew resource management.", url: "https://www.casa.gov.au/resources-and-education/publications-and-resources/safety-behaviours-human-factors-pilots", source: "CASA" },
      { title: "CASA Fitness for Flight", description: "Guidance on medical standards, drugs and alcohol, fatigue, and fitness to fly requirements.", url: "https://www.casa.gov.au/safety-management/health-and-fitness-fly", source: "CASA" },
      { title: "ATSB Human Factors Resources", description: "Research reports on spatial disorientation, fatigue, decision making, and human error in aviation.", url: "https://www.atsb.gov.au/publications/research_and_analysis_reports", source: "ATSB" },
    ],
  },
  "Navigation": {
    color: "#8E6AC8",
    resources: [
      { title: "Airservices Charts — AIP", description: "Official VNC, VTC, ERC, and TAC charts for Australian airspace and aerodromes.", url: "https://www.airservicesaustralia.com/aip/aip.asp", source: "Airservices Australia" },
      { title: "ERSA — En Route Supplement", description: "Aerodrome directory with runway data, frequencies, facilities, and operational information.", url: "https://www.airservicesaustralia.com/aip/aip.asp", source: "Airservices Australia" },
      { title: "AIP GEN 2.7 — First/Last Light", description: "Tables for computing first light and last light times at Australian locations.", url: "https://www.airservicesaustralia.com/aip/aip.asp", source: "Airservices Australia" },
    ],
  },
  "Performance": {
    color: "#48B0A2",
    resources: [
      { title: "RPL/PPL/CPL Workbook — Performance", description: "Workbook section covering takeoff and landing charts, weight and balance, and density altitude calculations.", url: "https://www.casa.gov.au/resources-and-education/publications-and-resources/flight-training/rpl-ppl-cpl-aeroplane-workbook", source: "CASA" },
      { title: "CASA Safety — Weight and Balance", description: "Guidance on loading, CG calculations, and the consequences of exceeding aircraft limitations.", url: "https://www.casa.gov.au/resources-and-education/pilot-safety-hub", source: "CASA" },
    ],
  },
  "Systems": {
    color: "#D4A05A",
    resources: [
      { title: "CASA — Aircraft Systems Knowledge", description: "Educational materials on piston engine operation, carburettor icing, flight instruments, and electrical systems.", url: "https://www.casa.gov.au/resources-and-education/pilot-safety-hub", source: "CASA" },
      { title: "RPL/PPL/CPL Workbook — Systems", description: "Workbook section covering engine operation, fuel systems, instruments, and aircraft systems.", url: "https://www.casa.gov.au/resources-and-education/publications-and-resources/flight-training/rpl-ppl-cpl-aeroplane-workbook", source: "CASA" },
    ],
  },
};

const tools: ToolItem[] = [
  {
    title: "E6B Flight Computer",
    description: "Practice time, speed, distance, fuel, wind triangle, density altitude, and TAS calculations.",
    href: "/resources/tools/e6b",
    accent: "#00D4AA",
    available: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M12 6V8" /><path d="M6 12H8" /><path d="M16 12H18" />
        <circle cx="12" cy="12" r="2" /><line x1="12" y1="12" x2="15.5" y2="7.5" />
      </svg>
    ),
  },
  {
    title: "Weight & Balance Calculator",
    description: "Calculate CG position and check it falls within the approved envelope for your aircraft.",
    href: "/resources/tools/weight-balance",
    accent: "#48B0A2",
    available: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="3" x2="12" y2="19" /><line x1="4" y1="7" x2="20" y2="7" />
        <path d="M4 7L6 13H2L4 7Z" /><path d="M20 7L22 13H18L20 7Z" />
        <line x1="8" y1="19" x2="16" y2="19" />
      </svg>
    ),
  },
];

export default function ResourcesPage() {
  const [loading, setLoading] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
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
        <div className="quiz-container">
          <div className="quiz-loading"><div className="quiz-spinner"></div><p>Loading...</p></div>
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
          <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#6B7B8D", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Log out
          </button>
        </div>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 8 }}>
          <a href="/dashboard" style={{ fontSize: 13, color: "#4A5568", textDecoration: "none" }}>← Dashboard</a>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>
            Resources
          </h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            Curated study resources and tools for Australian student pilots. All links go to official sources — CASA, BOM, Airservices, and ATSB.
          </p>
        </div>

        {/* Tools section */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 14px" }}>
            Interactive tools
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tools.map(tool => (
              <div
                key={tool.title}
                className="dash-card"
                style={{
                  textDecoration: "none",
                  opacity: tool.available ? 1 : 0.6,
                  cursor: tool.available ? "pointer" : "default",
                }}
                onClick={() => { if (tool.available) router.push(tool.href); }}
              >
                <div className="dash-card-icon" style={{ background: `${tool.accent}12`, color: tool.accent }}>
                  {tool.icon}
                </div>
                <div className="dash-card-content">
                  <div className="dash-card-title">
                    {tool.title}
                    {!tool.available && (
                      <span style={{ fontSize: 11, color: "#4A5568", fontWeight: 400, marginLeft: 8, padding: "2px 8px", borderRadius: 100, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>Coming soon</span>
                    )}
                  </div>
                  <div className="dash-card-desc">{tool.description}</div>
                </div>
                <div className="dash-card-arrow" style={{ color: tool.accent }}>{tool.available ? "→" : ""}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources by subject */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 14px" }}>
            Study resources by subject
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(resourcesBySubject).map(([subject, { color, resources }]) => {
              const isExpanded = expandedSubject === subject;
              return (
                <div key={subject}>
                  <button
                    onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                    style={{
                      width: "100%", padding: "14px 18px", borderRadius: isExpanded ? "12px 12px 0 0" : 12,
                      background: "#131F33", border: "1px solid rgba(255,255,255,0.06)",
                      borderBottom: isExpanded ? "none" : "1px solid rgba(255,255,255,0.06)",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                      fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#FFF", flex: 1 }}>{subject}</span>
                    <span style={{ fontSize: 12, color: "#4A5568", marginRight: 8 }}>{resources.length} resources</span>
                    <span style={{ fontSize: 16, color: "#4A5568", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                  </button>
                  {isExpanded && (
                    <div style={{
                      background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none",
                      borderRadius: "0 0 12px 12px", padding: "4px 0",
                    }}>
                      {resources.map((r, i) => (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block", padding: "12px 18px", textDecoration: "none",
                            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.03)" : "none",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <div style={{ fontSize: 14, fontWeight: 500, color: color, marginBottom: 3 }}>
                            {r.title}
                            <span style={{ fontSize: 14, color: "#4A5568", marginLeft: 6 }}>↗</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#6B7B8D", lineHeight: 1.5 }}>{r.description}</div>
                          <div style={{ fontSize: 11, color: "#4A5568", marginTop: 4 }}>{r.source}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            All resources link to official sources. Vectored is not affiliated with CASA, BOM, or Airservices Australia.
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
