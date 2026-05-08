"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Operator = {
  id: string;
  name: string;
  state: string;
  bases: string | null;
  primary_icao: string | null;
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
};

type Tier = "free" | "rpl" | "ppl" | "cpl" | "founding_pilot" | null;

const PAID_CAREERS_TIERS: Tier[] = ["cpl", "founding_pilot"];
const STATES = ["ALL", "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"] as const;
type StateFilter = typeof STATES[number];

// ---------------------------------------------------------------------------
// Marker styling
// ---------------------------------------------------------------------------
function markerColor(op: Operator): { bg: string; ring: string } {
  if (op.is_flight_school) return { bg: "#60A5FA", ring: "#1E40AF" }; // blue — flight school
  if (op.hires_low_hour === "Yes") return { bg: "#00D4AA", ring: "#047857" }; // green — low-hour friendly
  return { bg: "#EF9F27", ring: "#92400E" }; // amber — moderate+ experience
}

function buildDivIcon(L: any, op: Operator) {
  const { bg, ring } = markerColor(op);
  return L.divIcon({
    className: "vectored-pin",
    html: `<span style="
      display:block;width:14px;height:14px;border-radius:50%;
      background:${bg};border:2px solid ${ring};
      box-shadow:0 0 0 2px rgba(11,17,32,0.85);
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

// ---------------------------------------------------------------------------
// Popup HTML — built lazily per click, never for all 108 upfront
// ---------------------------------------------------------------------------
function buildPopupHtml(op: Operator): string {
  const escape = (s: string | null) =>
    (s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
    );

  const badge = op.is_flight_school
    ? `<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;background:rgba(96,165,250,0.15);color:#60A5FA;font-weight:600">Flight school</span>`
    : op.hires_low_hour === "Yes"
    ? `<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;background:rgba(0,212,170,0.15);color:#00D4AA;font-weight:600">Low-hour friendly</span>`
    : `<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;background:rgba(239,159,39,0.15);color:#EF9F27;font-weight:600">Moderate+ experience</span>`;

  const websiteRow = op.website
    ? `<a href="${escape(op.website)}" target="_blank" rel="noopener noreferrer" style="color:#60A5FA;text-decoration:none;font-size:12px;display:inline-block;margin-top:8px">Visit website →</a>`
    : "";

  const baseRow = op.bases
    ? `<div style="font-size:11px;color:#9CA3AF;margin-top:4px">${escape(op.bases)}</div>`
    : "";

  const fleetRow = op.fleet
    ? `<div style="font-size:11px;color:#D1D5DB;margin-top:8px"><strong style="color:#9CA3AF">Fleet:</strong> ${escape(op.fleet)}</div>`
    : "";

  const opsRow = op.operations
    ? `<div style="font-size:11px;color:#D1D5DB;margin-top:4px"><strong style="color:#9CA3AF">Operations:</strong> ${escape(op.operations)}</div>`
    : "";

  const hoursRow = op.min_hours
    ? `<div style="font-size:11px;color:#D1D5DB;margin-top:4px"><strong style="color:#9CA3AF">Min hours:</strong> ${escape(op.min_hours)}</div>`
    : "";

  const tipsRow = op.background_tips
    ? `<div style="font-size:11px;color:#D1D5DB;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08)">${escape(op.background_tips)}</div>`
    : "";

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;color:#F3F4F6;min-width:240px;max-width:300px">
      <div style="font-size:14px;font-weight:600;color:#FFFFFF">${escape(op.name)}</div>
      ${baseRow}
      <div style="margin-top:8px">${badge}</div>
      ${fleetRow}
      ${opsRow}
      ${hoursRow}
      ${tipsRow}
      ${websiteRow}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Asset loaders — Leaflet + MarkerCluster from CDN, loaded once per page life
// ---------------------------------------------------------------------------
const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
const LEAFLET_JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
const CLUSTER_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css";
const CLUSTER_DEFAULT_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css";
const CLUSTER_JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js";

function loadStylesheet(href: string): void {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if ((existing as any)._loaded) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed: ${src}`)), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      (script as any)._loaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed: ${src}`));
    document.body.appendChild(script);
  });
}

async function ensureLeaflet(): Promise<any> {
  loadStylesheet(LEAFLET_CSS);
  loadStylesheet(CLUSTER_CSS);
  loadStylesheet(CLUSTER_DEFAULT_CSS);
  await loadScript(LEAFLET_JS);
  await loadScript(CLUSTER_JS);
  return (window as any).L;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CareersPage() {
  // Data + auth state
  const [operators, setOperators] = useState<Operator[]>([]);
  const [tier, setTier] = useState<Tier>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [stateFilter, setStateFilter] = useState<StateFilter>("ALL");
  const [showFlightSchools, setShowFlightSchools] = useState(true);
  const [showOperators, setShowOperators] = useState(true);
  const [search, setSearch] = useState("");

  // Map refs — refs not state, so updates don't trigger re-renders
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const clusterGroupRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  const hasFullCareersAccess = PAID_CAREERS_TIERS.includes(tier);

  // -------------------------------------------------------------------------
  // 1. Load session + tier, then fetch operators
  // -------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Wait for any persisted session to restore from localStorage before
        // querying — RLS policies need a real JWT to evaluate.
        const { data: sessionData } = await supabase.auth.getSession();
        if (cancelled) return;

        let resolvedTier: Tier = null;
        if (sessionData.session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("tier, access_expires_at")
            .eq("id", sessionData.session.user.id)
            .single();

          if (profile) {
            const expired =
              profile.access_expires_at !== null &&
              new Date(profile.access_expires_at) <= new Date();
            resolvedTier = expired ? "free" : (profile.tier as Tier);
          }
        }

        if (cancelled) return;
        setTier(resolvedTier);
        setAuthReady(true);

        // Operators fetch — RLS does the gating server-side. Free / RPL / PPL /
        // anon callers will only see flight schools regardless of what the
        // client requests.
        const { data, error: fetchErr } = await supabase
          .from("operators")
          .select(
            "id, name, state, bases, primary_icao, latitude, longitude, website, phone, email, key_personnel, fleet, operations, min_hours, hires_low_hour, part_141_142, is_flight_school, background_tips"
          )
          .eq("published", true);

        if (cancelled) return;

        if (fetchErr) {
          setError(fetchErr.message);
        } else {
          setOperators((data ?? []) as Operator[]);
        }
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Unknown error");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // -------------------------------------------------------------------------
  // 2. Initialise the map — exactly once, after the container is mounted.
  //    No dependencies that change on filter, search, or operator updates.
  // -------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!mapContainerRef.current) return;
      const L = await ensureLeaflet();
      if (cancelled || !mapContainerRef.current) return;

      // Guard against double-init in React strict mode
      if (mapRef.current) return;

      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        preferCanvas: true, // canvas renderer — faster on pan/zoom for many markers
      }).setView([-25, 134], 4);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
        maxZoom: 18,
        subdomains: "abcd",
      }).addTo(map);

      const cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 11,
        maxClusterRadius: 50,
        chunkedLoading: true,
        spiderfyDistanceMultiplier: 1.6,
      });

      map.addLayer(cluster);

      mapRef.current = map;
      clusterGroupRef.current = cluster;
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      // Tear down only on unmount — never on filter/data changes
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        clusterGroupRef.current = null;
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // 3. Filter operators (memoised — same array reference unless inputs change)
  // -------------------------------------------------------------------------
  const visibleOperators = useMemo(() => {
    const q = search.trim().toLowerCase();
    return operators.filter((op) => {
      if (stateFilter !== "ALL" && op.state !== stateFilter) return false;
      if (op.is_flight_school && !showFlightSchools) return false;
      if (!op.is_flight_school && !showOperators) return false;
      if (q) {
        const haystack = `${op.name} ${op.bases ?? ""} ${op.state}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [operators, stateFilter, showFlightSchools, showOperators, search]);

  // -------------------------------------------------------------------------
  // 4. Sync markers to the cluster group whenever visible set changes.
  //    clearLayers + addLayers (batch) — never recreate the cluster group.
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!mapReady) return;
    const L = leafletRef.current;
    const cluster = clusterGroupRef.current;
    if (!L || !cluster) return;

    cluster.clearLayers();

    const markers = visibleOperators.map((op) => {
      const marker = L.marker([op.latitude, op.longitude], {
        icon: buildDivIcon(L, op),
        title: op.name,
      });
      // Lazy popup — HTML isn't built until the marker is clicked
      marker.bindPopup(() => buildPopupHtml(op), {
        maxWidth: 320,
        className: "vectored-popup",
      });
      return marker;
    });

    cluster.addLayers(markers);
  }, [visibleOperators, mapReady]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  const counts = useMemo(() => {
    const total = operators.length;
    const schools = operators.filter((o) => o.is_flight_school).length;
    const visible = visibleOperators.length;
    return { total, schools, visible };
  }, [operators, visibleOperators]);

  return (
    <div style={{ background: "#0B1120", color: "#F3F4F6", minHeight: "100vh" }}>
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: #1F2937 !important;
          color: #F3F4F6 !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
        }
        .leaflet-popup-tip {
          background: #1F2937 !important;
        }
        .leaflet-popup-close-button {
          color: #9CA3AF !important;
        }
        .marker-cluster-small,
        .marker-cluster-medium,
        .marker-cluster-large {
          background: rgba(96, 165, 250, 0.25) !important;
        }
        .marker-cluster-small div,
        .marker-cluster-medium div,
        .marker-cluster-large div {
          background: rgba(96, 165, 250, 0.7) !important;
          color: #FFFFFF !important;
          font-weight: 600 !important;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0 }}>Careers Hub</h1>
          <p style={{ color: "#9CA3AF", marginTop: 8, maxWidth: 640 }}>
            Verified Australian general aviation operators and flight schools.
            {!authReady ? null : hasFullCareersAccess ? (
              <span> Showing all {counts.total} entries.</span>
            ) : (
              <span>
                {" "}
                Free preview — showing {counts.schools} verified flight schools. Upgrade to CPL tier for the full operator database.
              </span>
            )}
          </p>
        </header>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
            padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
          }}
        >
          <input
            type="text"
            placeholder="Search by name or base…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 220px",
              minWidth: 200,
              padding: "8px 12px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              color: "#F3F4F6",
              fontSize: 13,
            }}
          />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value as StateFilter)}
            style={{
              padding: "8px 12px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              color: "#F3F4F6",
              fontSize: 13,
            }}
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All states" : s}
              </option>
            ))}
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#D1D5DB" }}>
            <input
              type="checkbox"
              checked={showFlightSchools}
              onChange={(e) => setShowFlightSchools(e.target.checked)}
            />
            Flight schools
          </label>
          {hasFullCareersAccess && (
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#D1D5DB" }}>
              <input
                type="checkbox"
                checked={showOperators}
                onChange={(e) => setShowOperators(e.target.checked)}
              />
              Operators
            </label>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#6B7280" }}>
            {counts.visible} of {counts.total} shown
          </span>
        </div>

        {/* Map */}
        <div
          style={{
            position: "relative",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            ref={mapContainerRef}
            style={{ height: 600, width: "100%", background: "#0B1120" }}
          />
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(11,17,32,0.7)",
                color: "#9CA3AF",
                fontSize: 14,
                pointerEvents: "none",
              }}
            >
              Loading operators…
            </div>
          )}
          {error && (
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 16,
                padding: "12px 16px",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 6,
                color: "#FCA5A5",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 16, fontSize: 12, color: "#9CA3AF" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#60A5FA", display: "inline-block" }} />
            Flight school
          </span>
          {hasFullCareersAccess && (
            <>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#00D4AA", display: "inline-block" }} />
                Low-hour friendly operator
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF9F27", display: "inline-block" }} />
                Moderate+ experience operator
              </span>
            </>
          )}
        </div>

        <p style={{ marginTop: 32, fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>
          Always verify details directly with operators. Vectored is not a recruitment agency.
          {" · "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#9CA3AF", textDecoration: "underline" }}>
            Terms of Use
          </a>
          {" · "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#9CA3AF", textDecoration: "underline" }}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
