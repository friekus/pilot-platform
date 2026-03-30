"use client";
import "../quiz/quiz.css";
import { useState, useEffect } from "react";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

type Operator = {
  name: string; loc: string; state: string; lat: number; lng: number;
  fleet: string; ops: string; min: string; low: boolean; note: string;
};

const operators: Operator[] = [
  {name:"Chartair",loc:"Darwin, NT",state:"NT",lat:-12.46,lng:130.84,fleet:"C210, PA-31 Navajo",ops:"Charter, freight, scenic",min:"250 total",low:true,note:"Well-known for hiring low-hour pilots. Great training environment in the Top End."},
  {name:"Hardy Aviation",loc:"Darwin, NT",state:"NT",lat:-12.42,lng:130.87,fleet:"C210, Metroliner",ops:"Charter, freight",min:"300 total",low:false,note:"Freight and charter operations across the Top End."},
  {name:"Air Frontier",loc:"Darwin, NT",state:"NT",lat:-12.48,lng:130.80,fleet:"C206, C210",ops:"Charter, scenic",min:"200 total",low:true,note:"Small operator, good for getting a start in remote flying."},
  {name:"Fly Tiwi",loc:"Tiwi Islands, NT",state:"NT",lat:-11.77,lng:130.64,fleet:"C206, BN Islander",ops:"Community charter",min:"250 total",low:true,note:"Flies to Tiwi Islands communities. Unique island operation."},
  {name:"Charter North",loc:"Darwin, NT",state:"NT",lat:-12.44,lng:130.88,fleet:"C210, King Air",ops:"Charter, FIFO",min:"300 total",low:false,note:"Darwin-based charter serving mining and remote communities."},
  {name:"Torres Strait Air",loc:"Horn Island, QLD",state:"QLD",lat:-10.59,lng:142.29,fleet:"C206, BN Islander",ops:"Community RPT, charter",min:"Cadet program",low:true,note:"Runs a cadet program for low-hour pilots. Excellent career pathway."},
  {name:"Hinterland Aviation",loc:"Cairns, QLD",state:"QLD",lat:-16.89,lng:145.76,fleet:"C206, C210, PC-12",ops:"Charter, RFDS support",min:"500 total",low:false,note:"Larger Cairns operation. Great next step after building 500hrs."},
  {name:"Cape York Airlines",loc:"Cairns, QLD",state:"QLD",lat:-16.93,lng:145.73,fleet:"C206, GA-8 Airvan",ops:"Community charter",min:"300 total",low:false,note:"Serves remote Cape York communities."},
  {name:"Gulf Air",loc:"Karumba, QLD",state:"QLD",lat:-17.46,lng:140.83,fleet:"C206",ops:"Charter, freight",min:"250 total",low:true,note:"Remote Gulf country operations. Real outback flying."},
  {name:"Skytrans",loc:"Cairns, QLD",state:"QLD",lat:-16.87,lng:145.75,fleet:"Dash 8",ops:"Regional RPT",min:"1000+ total",low:false,note:"Regional airline. Requires significant multi-engine experience."},
  {name:"Air Kimberley",loc:"Kununurra, WA",state:"WA",lat:-15.77,lng:128.74,fleet:"C206, C210",ops:"Scenic, charter",min:"200 total",low:true,note:"Scenic flights over the Kimberley. Known for giving pilots their first start."},
  {name:"Aviair",loc:"Kununurra, WA",state:"WA",lat:-15.78,lng:128.71,fleet:"Various SE/ME",ops:"Charter, scenic, FIFO",min:"350 total",low:false,note:"Larger Kimberley operator with good career progression."},
  {name:"Broome Aviation",loc:"Broome, WA",state:"WA",lat:-17.95,lng:122.23,fleet:"C206, Navajo",ops:"Charter",min:"300 total",low:false,note:"Broome-based charter serving the Kimberley coast."},
  {name:"Wrightsair",loc:"William Creek, SA",state:"SA",lat:-28.91,lng:136.34,fleet:"C210, GA-8 Airvan",ops:"Scenic (Lake Eyre)",min:"100 PIC / 200 total",low:true,note:"Hires from as low as 100 PIC / 200 total hours. Scenic flights over Lake Eyre. One of the best first jobs in Australia."},
  {name:"Par Avion",loc:"Cambridge, TAS",state:"TAS",lat:-42.84,lng:147.51,fleet:"C206, BN Islander",ops:"Scenic, charter",min:"250 total",low:true,note:"Scenic flights over SW Tasmania wilderness. Beautiful operation."},
  {name:"Seair Pacific",loc:"Redcliffe, QLD",state:"QLD",lat:-27.20,lng:153.10,fleet:"C206, Partenavia",ops:"Island charter",min:"300 total",low:false,note:"Charter flights to Moreton Bay islands from Brisbane area."},
  {name:"Edwards Aviation",loc:"Ballina, NSW",state:"NSW",lat:-28.83,lng:153.56,fleet:"Various",ops:"Charter, scenic",min:"350 total",low:false,note:"Northern NSW charter and scenic operations."},
  {name:"Sydney Seaplanes",loc:"Rose Bay, NSW",state:"NSW",lat:-33.87,lng:151.26,fleet:"C208 Caravan (floats)",ops:"Scenic, charter",min:"500 total",low:false,note:"Unique harbour seaplane operation. Requires C208 endorsement + float rating."},
  {name:"Air Central West",loc:"Mudgee, NSW",state:"NSW",lat:-32.56,lng:149.61,fleet:"C206, PA-31",ops:"Charter, freight",min:"300 total",low:false,note:"Regional NSW charter and freight operations."},
  {name:"Aero Pearl",loc:"Perth, WA",state:"WA",lat:-31.94,lng:115.97,fleet:"Various",ops:"Charter, scenic",min:"500 total",low:false,note:"Perth-based charter. Requires more experience."},
  {name:"Alliance Airlines",loc:"Brisbane, QLD",state:"QLD",lat:-27.39,lng:153.12,fleet:"F100, E190",ops:"Wet lease, FIFO RPT",min:"1500+ total",low:false,note:"Major wet lease operator. Requires significant jet/turbine experience."},
];

export default function CareersPage() {
  const [filter, setFilter] = useState("all");
  const [mapReady, setMapReady] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markersRef, setMarkersRef] = useState<any[]>([]);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const leaflet = (window as any).L;
      setL(leaflet);
      const map = leaflet.map("careers-map", { scrollWheelZoom: false, zoomControl: true }).setView([-25, 134], 4);
      leaflet.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18, subdomains: "abcd"
      }).addTo(map);
      setMapInstance(map);
      setMapReady(true);
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstance || !L) return;

    // Clear existing markers
    markersRef.forEach(m => mapInstance.removeLayer(m));
    const newMarkers: any[] = [];

    operators.forEach(op => {
      if (filter !== "all" && filter !== "low" && op.state !== filter) return;
      if (filter === "low" && !op.low) return;

      const col = op.low ? "#00D4AA" : (parseInt(op.min) || 500) <= 350 ? "#EF9F27" : "#888780";
      const r = op.low ? 8 : 6;

      const m = L.circleMarker([op.lat, op.lng], {
        radius: r, fillColor: col, color: "#0B1120", weight: 2, fillOpacity: 0.9
      }).addTo(mapInstance);

      const badge = op.low
        ? '<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;margin-top:6px;background:rgba(0,212,170,0.15);color:#00D4AA">Low-hour friendly</span>'
        : '<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;margin-top:6px;background:rgba(239,159,39,0.15);color:#EF9F27">Moderate+ experience</span>';

      m.bindPopup(`
        <div style="min-width:200px;font-family:DM Sans,sans-serif">
          <div style="font-weight:600;font-size:14px;margin-bottom:2px">${op.name}</div>
          <div style="font-size:12px;color:#888;margin-bottom:8px">${op.loc}</div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #eee"><span style="color:#888">Fleet</span><span style="font-weight:500">${op.fleet}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #eee"><span style="color:#888">Operations</span><span style="font-weight:500">${op.ops}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#888">Min hours</span><span style="font-weight:500">${op.min}</span></div>
          <div style="font-size:11px;color:#666;margin-top:6px;line-height:1.4">${op.note}</div>
          ${badge}
        </div>
      `, { maxWidth: 280 });

      newMarkers.push(m);
    });

    setMarkersRef(newMarkers);

    // Zoom to region
    const views: Record<string, [number, number, number]> = {
      all: [-25, 134, 4], low: [-20, 134, 4], NT: [-13, 131, 7], WA: [-20, 124, 5],
      QLD: [-16, 144, 6], SA: [-29, 136, 6], TAS: [-42, 147, 7], NSW: [-32, 150, 6],
    };
    const v = views[filter] || views.all;
    mapInstance.setView([v[0], v[1]], v[2]);
  }, [filter, mapReady, mapInstance, L]);

  const filters = ["all", "low", "NT", "WA", "QLD", "SA", "TAS", "NSW"];
  const filterLabels: Record<string, string> = {
    all: "All operators", low: "Low-hour friendly", NT: "NT", WA: "WA",
    QLD: "QLD", SA: "SA", TAS: "TAS", NSW: "NSW"
  };

  const lowCount = operators.filter(o => o.low).length;
  const totalCount = operators.length;

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

      <nav className="quiz-nav">
        <a href="/dashboard" className="quiz-logo-link">
          <Logo size={34} />
          <span className="quiz-logo-text">Vectored</span>
        </a>
        <a href="/quiz" className="quiz-score-pill" style={{ textDecoration: "none" }}>Practice quizzes</a>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 8 }}><a href="/dashboard" style={{ fontSize: 13, color: "#4A5568", textDecoration: "none" }}>{"←"} Dashboard</a></div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>Where the jobs are</h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            {totalCount} charter and GA operators across Australia. {lowCount} are known to hire pilots with fewer than 300 hours. Click any pin for details.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 8,
              border: filter === f ? "1px solid #5DCAA5" : "1px solid rgba(255,255,255,0.08)",
              background: filter === f ? "rgba(0,212,170,0.1)" : "transparent",
              color: filter === f ? "#00D4AA" : "#6B7B8D",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            }}>
              {filterLabels[f]}
            </button>
          ))}
        </div>

        {/* Map */}
        <div id="careers-map" style={{
          width: "100%", height: 480, borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "#131F33",
        }} />

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12, color: "#6B7B8D", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#00D4AA", display: "inline-block" }} />
            Low-hour friendly (200–300hr)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF9F27", display: "inline-block" }} />
            Moderate (300–500hr)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#888780", display: "inline-block" }} />
            Experienced (500hr+)
          </span>
        </div>

        {/* Info section */}
        <div style={{ marginTop: 40, padding: 24, background: "#131F33", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 12px" }}>Getting your first flying job</h2>
          <p style={{ fontSize: 14, color: "#8899AA", lineHeight: 1.7, margin: "0 0 16px" }}>
            Most entry-level charter jobs are in the Northern Territory, Western Australia, and Far North Queensland. Operators in these regions regularly hire pilots with 200–300 total hours. The key advice from chief pilots who actually hire:
          </p>
          <div style={{ fontSize: 14, color: "#8899AA", lineHeight: 1.8 }}>
            <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#00D4AA" }}>Show up in person.</strong> Drive north, knock on doors, hand-deliver your resume. Emails get lost — face-to-face meetings don&apos;t.</p>
            <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#00D4AA" }}>Time it right.</strong> The dry season (April–October) is hiring season in the NT and WA. Operators avoid training new pilots during the wet.</p>
            <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#00D4AA" }}>Be patient.</strong> Budget for 6–12 months without flying income. Take ground roles if offered — it gets you inside the door.</p>
            <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#00D4AA" }}>Any flying is good flying.</strong> Scenic flights, skydive pilot, cost-sharing cross-countries — it all builds hours and keeps you current.</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            Operator data is for guidance only. Always verify details directly with operators. Vectored is not a recruitment agency.
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
