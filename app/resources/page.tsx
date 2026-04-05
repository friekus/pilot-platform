"use client";
import "../quiz/quiz.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

type Resource = { title: string; description: string; url: string; source: string };
type ToolItem = { title: string; description: string; href: string; accent: string; icon: React.ReactNode; available: boolean };

// ─── Essential Resources ───
const essentialResources: Resource[] = [
  { title: "Visual Flight Rules Guide (VFRG) v8.3", description: "The essential reference for VFR operations — airspace, VMC minima, radio calls, and procedures. Allowed in RPL/PPL exams.", url: "https://www.casa.gov.au/resources-and-education/publications/industry-guides/pilot-guides-and-maps/visual-flight-rules-guide", source: "CASA" },
  { title: "Part 91 Plain English Guide v5.2", description: "Plain English explanation of the General Operating and Flight Rules — fuel, flight planning, documentation, and operational rules.", url: "https://www.casa.gov.au/resources-and-education/publications/plain-english-guides/casr-part-91-plain-english-guide-general-operating-and-flight-rules#Whowillbenefit", source: "CASA" },
  { title: "Part 61 Guide — Aeroplane Category", description: "Flight crew licensing — RPL, PPL, CPL privileges, limitations, recency requirements, flight reviews, and endorsements.", url: "https://www.casa.gov.au/resources-and-education/publications/plain-english-guides/casr-part-61-guide-aeroplane-category-flight-crew-licensing#Whotheguideisfor", source: "CASA" },
  { title: "AIP Australia", description: "The official Aeronautical Information Publication — ENR, AD, GEN, ERSA, charts, and aerodrome data.", url: "https://www.airservicesaustralia.com/aip/aip.asp", source: "Airservices Australia" },
  { title: "NAIPS — Flight Planning", description: "National Aeronautical Information Processing System for NOTAMs, weather briefings, and flight plan submission.", url: "https://www.airservicesaustralia.com/naips/", source: "Airservices Australia" },
  { title: "RPL/PPL/CPL Aeroplane Workbook", description: "CASA's official study workbook covering all BAK and GFPT subjects — aerodynamics, navigation, meteorology, human factors, performance, and systems.", url: "https://www.casa.gov.au/rpl-ppl-and-cpl-aeroplane-workbook", source: "CASA" },
  { title: "RPL Aeroplane Exam — CASA", description: "Exam overview, structure, pass rates, and what to expect for the Recreational Pilot Licence aeroplane theory exam.", url: "https://www.casa.gov.au/licences-and-certificates/pilots/pilot-and-flight-crew-exams/pilot-exams/recreational-pilot-licence-aeroplane-exam-rpla#Passrates", source: "CASA" },
  { title: "ATSB Aviation Investigation Reports", description: "Aviation accident and incident reports from the Australian Transport Safety Bureau — real-world case studies across all subjects.", url: "https://www.atsb.gov.au/aviation-investigation-reports", source: "ATSB" },
  { title: "Flight Safety Australia", description: "CASA's aviation safety magazine — articles on aerodynamics, weather, human factors, operational safety, and close calls.", url: "https://www.flightsafetyaustralia.com/", source: "CASA / Flight Safety Australia" },
  { title: "All CASA Plain English Guides", description: "Full list of CASA plain English guides — VFRG, Part 91, Part 61, Part 141, and more in one place.", url: "https://www.casa.gov.au/resources-and-education/publications/plain-english-guides", source: "CASA" },
];

// ─── Subject-specific resources ───
const resourcesBySubject: Record<string, { color: string; resources: Resource[] }> = {
  "Aerodynamics": {
    color: "#00D4AA",
    resources: [
      { title: "CASA — Spin Avoidance and Stall Recovery", description: "Guidance on advanced stalling, wing drop at the stall, spin avoidance, and recovery techniques.", url: "https://www.casa.gov.au/licences-and-certificates/flight-instructors/spin-avoidance-and-stall-recovery", source: "CASA" },
      { title: "SKYbrary — Aerodynamic Stall Awareness", description: "Comprehensive reference on stall causes, recognition, and recovery — covers load factor, icing, and configuration.", url: "https://skybrary.aero/articles/aerodynamic-stall-awareness-and-avoidance", source: "SKYbrary / EUROCONTROL" },
    ],
  },
  "Air Law": {
    color: "#5D9CEC",
    resources: [
      { title: "Pilot Safety Hub — Controlled Aerodromes", description: "Resources on radio calls, ATC procedures, runway safety, and operating at controlled aerodromes.", url: "https://www.casa.gov.au/resources-and-education/pilot-safety-hub/controlled-aerodromes", source: "CASA" },
      { title: "Part 91 Regulatory Framework", description: "The full Part 91 regulatory page — regulations, MOS, advisory circulars, exemptions, and legislative instruments.", url: "https://www.casa.gov.au/rules/regulatory-framework/casr/part-91-casr-general-operating-and-flight-rules", source: "CASA" },
      { title: "Part 61 Regulatory Framework", description: "The full Part 61 regulatory page — flight crew licensing regulations, MOS, advisory circulars, and guidance material.", url: "https://www.casa.gov.au/rules/regulatory-framework/casr/part-61-casr-flight-crew-licensing", source: "CASA" },
    ],
  },
  "Meteorology": {
    color: "#F6BB42",
    resources: [
      { title: "BOM Aviation Knowledge Centre", description: "Official BOM guides on TAFs, METARs, GAFs, weather hazards, and aviation forecasting.", url: "https://www.bom.gov.au/aviation/knowledge-centre/", source: "Bureau of Meteorology" },
      { title: "TAF & METAR Reference Card", description: "Quick reference card for decoding TAF and METAR reports — all codes, abbreviations, and formats on one page.", url: "https://www.bom.gov.au/aviation/data/education/taf-metar-speci-reference-card.pdf", source: "Bureau of Meteorology" },
      { title: "Graphical Area Forecast (GAF)", description: "Live GAFs showing cloud, visibility, turbulence, and icing forecasts across Australia.", url: "https://www.bom.gov.au/aviation/gaf/gaf.shtml", source: "Bureau of Meteorology" },
      { title: "Aerodrome Forecasts (TAF)", description: "Search and view current TAFs for any Australian aerodrome by ICAO code or name.", url: "https://www.bom.gov.au/aviation/forecasts/taf/", source: "Bureau of Meteorology" },
      { title: "Weather Packages", description: "Complete weather briefing packages by aerodrome — MSLP charts, satellite, GAF, TAF, METAR, and Area QNH.", url: "https://www.bom.gov.au/aviation/weather-packages/", source: "Bureau of Meteorology" },
      { title: "BOM Aerodrome Climatologies", description: "Cloud, visibility, wind, and temperature statistics for over 250 Australian aerodromes.", url: "https://www.bom.gov.au/aviation/climate/", source: "Bureau of Meteorology" },
    ],
  },
  "Human Factors": {
    color: "#E96B56",
    resources: [
      { title: "Safety Behaviours: Human Factors for Pilots", description: "CASA's 10 resource booklets and workbook — communication, decision making, teamwork, situational awareness, fatigue, and stress.", url: "https://www.casa.gov.au/search-centre/safety-kits/safety-behaviours-human-factors-pilots", source: "CASA" },
      { title: "Aviation Safety Resources for Pilots", description: "Decision-making tools, checklists, close calls, safety posters, and webinar recordings.", url: "https://www.casa.gov.au/operations-safety-and-travel/aviation-safety-and-security-pilots/aviation-safety-resources-pilots", source: "CASA" },
    ],
  },
  "Navigation": {
    color: "#8E6AC8",
    resources: [
      { title: "Pilot Safety Hub — Flight Planning", description: "Resources on flight planning — TAF interpretation, fuel planning, weight and balance, and pre-flight preparation.", url: "https://www.casa.gov.au/resources-and-education/pilot-safety-hub/flight-planning", source: "CASA" },
      { title: "BOM Aviation Services", description: "Central hub for all BOM aviation products — METARs, TAFs, GAFs, SIGMETs, aerological diagrams, and volcanic ash.", url: "https://www.bom.gov.au/aviation/", source: "Bureau of Meteorology" },
    ],
  },
  "Performance": {
    color: "#48B0A2",
    resources: [
      { title: "Part 91 — Flight Rules and Performance", description: "Part 91 regulatory framework — takeoff and landing minima, fuel requirements, and performance planning.", url: "https://www.casa.gov.au/rules/regulatory-framework/casr/part-91-casr-general-operating-and-flight-rules", source: "CASA" },
    ],
  },
  "Systems": {
    color: "#D4A05A",
    resources: [
      { title: "ATSB Aviation Safety Investigations", description: "Investigation findings covering engine failures, fuel management issues, instrument malfunctions, and systems failures.", url: "https://www.atsb.gov.au/aviation-investigations", source: "ATSB" },
    ],
  },
};

const tools: ToolItem[] = [
  {
    title: "E6B Flight Computer",
    description: "Practice time, speed, distance, fuel, wind triangle, density altitude, and TAS calculations.",
    href: "/resources/tools/e6b", accent: "#00D4AA", available: true,
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6V8" /><path d="M6 12H8" /><path d="M16 12H18" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="12" x2="15.5" y2="7.5" /></svg>),
  },
  {
    title: "Weight & Balance Calculator",
    description: "Calculate CG position and check it falls within the approved envelope for your aircraft.",
    href: "/resources/tools/weight-balance", accent: "#48B0A2", available: false,
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="3" x2="12" y2="19" /><line x1="4" y1="7" x2="20" y2="7" /><path d="M4 7L6 13H2L4 7Z" /><path d="M20 7L22 13H18L20 7Z" /><line x1="8" y1="19" x2="16" y2="19" /></svg>),
  },
];

function ResourceLink({ r, color }: { r: Resource; color: string }) {
  return (
    <a href={r.url} target="_blank" rel="noopener noreferrer"
      style={{ display: "block", padding: "12px 18px", textDecoration: "none", borderTop: "1px solid rgba(255,255,255,0.03)", transition: "background 0.15s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
      <div style={{ fontSize: 14, fontWeight: 500, color, marginBottom: 3 }}>{r.title}<span style={{ fontSize: 14, color: "#4A5568", marginLeft: 6 }}>↗</span></div>
      <div style={{ fontSize: 13, color: "#6B7B8D", lineHeight: 1.5 }}>{r.description}</div>
      <div style={{ fontSize: 11, color: "#4A5568", marginTop: 4 }}>{r.source}</div>
    </a>
  );
}

export default function ResourcesPage() {
  const [loading, setLoading] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [showEssentials, setShowEssentials] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };

  if (loading) {
    return (<div className="quiz-root"><div className="quiz-container"><div className="quiz-loading"><div className="quiz-spinner"></div><p>Loading...</p></div></div></div>);
  }

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <nav className="quiz-nav">
        <a href="/dashboard" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#6B7B8D", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Log out</button>
        </div>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 8 }}>
          <a href="/dashboard" style={{ fontSize: 13, color: "#4A5568", textDecoration: "none" }}>← Dashboard</a>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>Resources</h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>Interactive tools, essential resources, and curated study materials for Australian student pilots.</p>
        </div>

        {/* ─── Interactive Tools ─── */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 14px" }}>Interactive tools</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tools.map(tool => (
              <div key={tool.title} className="dash-card"
                style={{ textDecoration: "none", opacity: tool.available ? 1 : 0.6, cursor: tool.available ? "pointer" : "default" }}
                onClick={() => { if (tool.available) router.push(tool.href); }}>
                <div className="dash-card-icon" style={{ background: `${tool.accent}12`, color: tool.accent }}>{tool.icon}</div>
                <div className="dash-card-content">
                  <div className="dash-card-title">{tool.title}{!tool.available && <span style={{ fontSize: 11, color: "#4A5568", fontWeight: 400, marginLeft: 8, padding: "2px 8px", borderRadius: 100, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>Coming soon</span>}</div>
                  <div className="dash-card-desc">{tool.description}</div>
                </div>
                <div className="dash-card-arrow" style={{ color: tool.accent }}>{tool.available ? "→" : ""}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Study Resources by Subject ─── */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 14px" }}>Study resources by subject</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(resourcesBySubject).map(([subject, { color, resources }]) => {
              const isExpanded = expandedSubject === subject;
              return (
                <div key={subject}>
                  <button onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                    style={{ width: "100%", padding: "14px 18px", borderRadius: isExpanded ? "12px 12px 0 0" : 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", borderBottom: isExpanded ? "none" : "1px solid rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#FFF", flex: 1 }}>{subject}</span>
                    <span style={{ fontSize: 12, color: "#4A5568", marginRight: 8 }}>{resources.length}</span>
                    <span style={{ fontSize: 16, color: "#4A5568", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                  </button>
                  {isExpanded && (
                    <div style={{ background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "4px 0" }}>
                      {resources.map((r, i) => <ResourceLink key={i} r={r} color={color} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Essential Resources ─── */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 14px" }}>Essential resources</h3>
          <p style={{ fontSize: 13, color: "#6B7B8D", margin: "0 0 12px", lineHeight: 1.5 }}>
            Core documents, guides, and official sources that apply across all subjects.
          </p>
          <div>
            <button onClick={() => setShowEssentials(!showEssentials)}
              style={{ width: "100%", padding: "14px 18px", borderRadius: showEssentials ? "12px 12px 0 0" : 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", borderBottom: showEssentials ? "none" : "1px solid rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: "#FFF", flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 600, color: "#FFF", flex: 1 }}>VFRG, PEGs, AIP, ERSA, Workbook, and more</span>
              <span style={{ fontSize: 12, color: "#4A5568", marginRight: 8 }}>{essentialResources.length}</span>
              <span style={{ fontSize: 16, color: "#4A5568", transition: "transform 0.2s", transform: showEssentials ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
            </button>
            {showEssentials && (
              <div style={{ background: "#131F33", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "4px 0" }}>
                {essentialResources.map((r, i) => <ResourceLink key={i} r={r} color="#FFF" />)}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            All resources link to official sources. Vectored is not affiliated with CASA, BOM, or Airservices Australia.
            <br /><a href="/terms" style={{ color: "#4A5568", textDecoration: "underline" }}>Terms</a>{" · "}<a href="/privacy" style={{ color: "#4A5568", textDecoration: "underline" }}>Privacy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
