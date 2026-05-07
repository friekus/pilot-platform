"use client";
import "../quiz/quiz.css";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cbvzjovbheiavmkalmaz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidnpqb3ZiaGVpYXZta2FsbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDA2MDUsImV4cCI6MjA4OTkxNjYwNX0.elpc_IUb9dot2ljnFMXGQnWAQ1aAb8krb2-QxC2jnKw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Operator = {
  id: string;
  name: string;
  slug: string;
  state: string;
  bases: string;
  latitude: number;
  longitude: number;
  website: string | null;
  phone: string | null;
  email: string | null;
  key_personnel: string | null;
  fleet: string | null;
  operations: string | null;
  min_hours: string | null;
  hires_low_hour: string | null;
  part_141_142: string | null;
  is_flight_school: boolean;
  background_tips: string | null;
  claim_status: string;
};

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" />
      <circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} />
      <path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" />
    </svg>
  );
}

function pinColor(op: Operator): string {
  if (op.is_flight_school) return "#6C8EBF";
  const h = (op.hires_low_hour ?? "").toLowerCase();
  if (h === "yes") return "#00D4AA";
  if (h === "possibly") return "#F59E0B";
  if (h === "no") return "#4A6FA5";
  return "#64748B";
}

function makeSvgIcon(color: string, isSchool: boolean): string {
  const shape = isSchool
    ? `<rect x="6" y="6" width="20" height="20" rx="4" fill="${color}" opacity="0.95"/>`
    : `<circle cx="16" cy="14" r="9" fill="${color}" opacity="0.95"/><polygon points="16,30 10,18 22,18" fill="${color}" opacity="0.95"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${shape}</svg>`;
}

function hiresLabel(val: string | null): { text: string; color: string } {
  const v = (val ?? "").toLowerCase();
  if (v === "yes") return { text: "Hires low-hour", color: "#00D4AA" };
  if (v === "possibly") return { text: "Possibly", color: "#F59E0B" };
  if (v === "no") return { text: "Higher hours req.", color: "#4A6FA5" };
  if (v === "n/a") return { text: "N/A", color: "#64748B" };
  return { text: "Unknown", color: "#64748B" };
}

const STATES = ["All", "NT", "QLD", "WA", "NSW", "VIC", "SA", "TAS", "ACT"];

export default function CareersPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedOp, setSelectedOp] = useState<Operator | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Fetch with explicit token
  async function fetchOperators(token: string | null) {
    const client = token
      ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } }
        })
      : supabase;

    const { data, error } = await client
      .from("operators")
      .select("*")
      .eq("published", true)
      .order("name");

    if (error) {
      setError("Failed to load operators. Please try again.");
      console.error("Supabase error:", error);
    } else {
      setOperators(data ?? []);
    }
    setLoading(false);
  }

  // Use onAuthStateChange so we catch the session as soon as it's restored
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchOperators(session?.access_token ?? null);
    });

    // Also fire immediately in case auth state is already known
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchOperators(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialise Leaflet
  useEffect(() => {
    if (!mapRef.current || mapReady) return;
    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      // @ts-ignore
      const { MarkerClusterGroup } = await import("leaflet.markercluster");
      await import("leaflet.markercluster/dist/MarkerCluster.css");
      await import("leaflet.markercluster/dist/MarkerCluster.Default.css");
      if (!mapRef.current) return;
      const map = L.map(mapRef.current, { center: [-25.5, 134.0], zoom: 4, zoomControl: true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd", maxZoom: 19,
      }).addTo(map);
      leafletRef.current = { map, L, MarkerClusterGroup };
      setMapReady(true);
    };
    initMap();
  }, []);

  // Render markers
  useEffect(() => {
    if (!mapReady || !leafletRef.current) return;
    const { map, L, MarkerClusterGroup } = leafletRef.current;
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    const filtered = selectedState === "All" ? operators : operators.filter((o) => o.state === selectedState);
    const cluster = new MarkerClusterGroup({ spiderfyOnMaxZoom: true, showCoverageOnHover: false, maxClusterRadius: 50 });
    filtered.forEach((op) => {
      const color = pinColor(op);
      const icon = L.divIcon({ html: makeSvgIcon(color, op.is_flight_school), className: "", iconSize: [32, 32], iconAnchor: [16, 30], popupAnchor: [0, -30] });
      const marker = L.marker([op.latitude, op.longitude], { icon });
      marker.on("click", () => setSelectedOp(op));
      cluster.addLayer(marker);
      markersRef.current.push(marker);
    });
    map.addLayer(cluster);
    markersRef.current.push(cluster);
  }, [operators, selectedState, mapReady]);

  const filteredOps = selectedState === "All" ? operators : operators.filter((o) => o.state === selectedState);
  const schoolCount = operators.filter((o) => o.is_flight_school).length;
  const operatorCount = operators.filter((o) => !o.is_flight_school).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", color: "#E2E8F0", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0F1D2F" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logo size={34} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.02em" }}>Vectored</span>
        </a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/quiz" style={{ color: "#94A3B8", textDecoration: "none", fontSize: 14 }}>Exam Prep</a>
          <a href="/careers" style={{ color: "#00D4AA", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Careers</a>
          <a href="/resources" style={{ color: "#94A3B8", textDecoration: "none", fontSize: 14 }}>Resources</a>
        </div>
      </nav>

      <div style={{ padding: "32px 24px 20px", maxWidth: 1400, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#E2E8F0", margin: 0, letterSpacing: "-0.03em" }}>Careers Hub</h1>
        <p style={{ color: "#64748B", marginTop: 6, fontSize: 14 }}>
          Verified Australian GA operators and flight schools.
          {!loading && (<> Showing <span style={{ color: "#00D4AA" }}>{operatorCount} operators</span> and <span style={{ color: "#6C8EBF" }}>{schoolCount} flight schools</span>.</>)}
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
          {[
            { color: "#00D4AA", label: "Hires low-hour" },
            { color: "#F59E0B", label: "Possibly hires low-hour" },
            { color: "#4A6FA5", label: "Higher hours required" },
            { color: "#6C8EBF", shape: "square", label: "Flight school" },
          ].map(({ color, shape, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8" }}>
              <div style={{ width: 10, height: 10, borderRadius: shape === "square" ? 2 : "50%", background: color, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 24px 16px", maxWidth: 1400, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {STATES.map((s) => (
          <button key={s} onClick={() => { setSelectedState(s); setSelectedOp(null); }}
            style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer",
              border: selectedState === s ? "1px solid #00D4AA" : "1px solid rgba(255,255,255,0.1)",
              background: selectedState === s ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.04)",
              color: selectedState === s ? "#00D4AA" : "#94A3B8", transition: "all 0.15s" }}>
            {s}
          </button>
        ))}
        {selectedState !== "All" && (
          <span style={{ fontSize: 12, color: "#64748B", alignSelf: "center" }}>
            {filteredOps.length} result{filteredOps.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px 40px", display: "grid", gridTemplateColumns: selectedOp ? "1fr 380px" : "1fr", gap: 16 }}>
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", height: 600 }}>
          {loading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0F1D2F", zIndex: 10 }}>
              <div style={{ color: "#64748B", fontSize: 13 }}>Loading operators…</div>
            </div>
          )}
          {error && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0F1D2F", zIndex: 10 }}>
              <div style={{ color: "#EF4444", fontSize: 13 }}>{error}</div>
            </div>
          )}
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        </div>

        {selectedOp && (
          <div style={{ background: "#0F1D2F", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", padding: 24, overflowY: "auto", maxHeight: 600, position: "relative" }}>
            <button onClick={() => setSelectedOp(null)}
              style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.06)", border: "none", color: "#94A3B8", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
              ✕
            </button>
            <div style={{ marginBottom: 16, paddingRight: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                {selectedOp.is_flight_school && (
                  <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(108,142,191,0.15)", color: "#6C8EBF", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>Flight School</span>
                )}
                {(() => { const { text, color } = hiresLabel(selectedOp.hires_low_hour); return (
                  <span style={{ fontSize: 10, fontWeight: 600, background: `${color}1A`, color, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{text}</span>
                ); })()}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0", margin: 0, letterSpacing: "-0.02em" }}>{selectedOp.name}</h2>
              <p style={{ color: "#64748B", fontSize: 13, margin: "4px 0 0" }}>{selectedOp.bases} · {selectedOp.state}</p>
            </div>

            {[
              { label: "Operations", value: selectedOp.operations },
              { label: "Fleet", value: selectedOp.fleet },
              { label: "Min. hours", value: selectedOp.min_hours },
              { label: "Part 141/142", value: selectedOp.part_141_142 },
              { label: "Key personnel", value: selectedOp.key_personnel },
            ].map(({ label, value }) => value && value !== "Unknown" && value !== "N/A" ? (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#CBD5E1" }}>{value}</div>
              </div>
            ) : null)}

            {selectedOp.background_tips && (
              <div style={{ marginBottom: 16, padding: "12px 14px", background: "rgba(0,212,170,0.06)", borderRadius: 8, borderLeft: "3px solid rgba(0,212,170,0.4)" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#00D4AA", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Background</div>
                <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{selectedOp.background_tips}</div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {selectedOp.website && (
                <a href={selectedOp.website} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#00D4AA", color: "#0A1628", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  Visit website ↗
                </a>
              )}
              {selectedOp.phone && (
                <a href={`tel:${selectedOp.phone}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,255,255,0.06)", color: "#CBD5E1", borderRadius: 8, fontSize: 13, textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)" }}>
                  📞 {selectedOp.phone}
                </a>
              )}
              {selectedOp.email && (
                <a href={`mailto:${selectedOp.email}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,255,255,0.06)", color: "#CBD5E1", borderRadius: 8, fontSize: 13, textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)" }}>
                  ✉ {selectedOp.email}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
