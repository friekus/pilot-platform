"use client";
import "../../../quiz/quiz.css";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

type CalcTab = "tsd" | "fuel" | "wind" | "da" | "tas" | "conversions";

const tabs: { id: CalcTab; label: string }[] = [
  { id: "tsd", label: "Time / Speed / Distance" },
  { id: "fuel", label: "Fuel" },
  { id: "wind", label: "Wind Triangle" },
  { id: "da", label: "Density Altitude" },
  { id: "tas", label: "TAS" },
  { id: "conversions", label: "Conversions" },
];

function InputField({ label, value, onChange, placeholder, unit }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; unit?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "#6B7B8D", display: "block", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)", background: "#0F1D2F",
            color: "#FFF", fontSize: 15, fontFamily: "'Space Grotesk', sans-serif",
            outline: "none",
          }}
        />
        {unit && <span style={{ fontSize: 13, color: "#4A5568", minWidth: 30 }}>{unit}</span>}
      </div>
    </div>
  );
}

function ResultBox({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(0,212,170,0.04)", border: "1px solid rgba(0,212,170,0.12)", marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || "#00D4AA", fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}{unit && <span style={{ fontSize: 14, fontWeight: 400, color: "#6B7B8D", marginLeft: 6 }}>{unit}</span>}
      </div>
    </div>
  );
}

function WorkingStep({ step, formula, result }: { step: string; formula?: string; result?: string }) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      <div style={{ fontSize: 13, color: "#8899AA", lineHeight: 1.5 }}>{step}</div>
      {formula && <div style={{ fontSize: 13, color: "#5D9CEC", fontFamily: "'DM Mono', 'SF Mono', monospace", marginTop: 2 }}>{formula}</div>}
      {result && <div style={{ fontSize: 13, color: "#00D4AA", fontWeight: 600, marginTop: 2 }}>{result}</div>}
    </div>
  );
}

function CalcButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="quiz-btn quiz-btn-primary"
      style={{ width: "100%", marginTop: 8, marginBottom: 16 }}
    >
      Calculate
    </button>
  );
}

function TSDCalculator() {
  const [mode, setMode] = useState<"distance" | "speed" | "time">("distance");
  const [speed, setSpeed] = useState("");
  const [time, setTime] = useState("");
  const [distance, setDistance] = useState("");
  const [result, setResult] = useState<{ value: number; working: { step: string; formula?: string; result?: string }[] } | null>(null);

  const calculate = () => {
    if (mode === "distance" && speed && time) {
      const s = parseFloat(speed);
      const t = parseFloat(time);
      const d = (s * t) / 60;
      setResult({
        value: Math.round(d * 10) / 10,
        working: [
          { step: "Distance = Speed × Time", formula: `D = ${s} kt × ${t} min ÷ 60` },
          { step: "Result", result: `${Math.round(d * 10) / 10} NM` },
        ],
      });
    } else if (mode === "speed" && distance && time) {
      const d = parseFloat(distance);
      const t = parseFloat(time);
      const s = (d / t) * 60;
      setResult({
        value: Math.round(s * 10) / 10,
        working: [
          { step: "Speed = Distance ÷ Time × 60", formula: `S = ${d} NM ÷ ${t} min × 60` },
          { step: "Result", result: `${Math.round(s * 10) / 10} kt` },
        ],
      });
    } else if (mode === "time" && speed && distance) {
      const s = parseFloat(speed);
      const d = parseFloat(distance);
      const t = (d / s) * 60;
      setResult({
        value: Math.round(t * 10) / 10,
        working: [
          { step: "Time = Distance ÷ Speed × 60", formula: `T = ${d} NM ÷ ${s} kt × 60` },
          { step: "Result", result: `${Math.round(t * 10) / 10} min` },
        ],
      });
    }
  };

  const modeOptions = [
    { id: "distance" as const, label: "Find Distance" },
    { id: "speed" as const, label: "Find Speed" },
    { id: "time" as const, label: "Find Time" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {modeOptions.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setResult(null); }}
            style={{ padding: "6px 14px", borderRadius: 100, border: `1px solid ${mode === m.id ? "#00D4AA" : "rgba(255,255,255,0.08)"}`, background: mode === m.id ? "rgba(0,212,170,0.1)" : "transparent", color: mode === m.id ? "#00D4AA" : "#6B7B8D", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {m.label}
          </button>
        ))}
      </div>
      {mode !== "speed" && <InputField label="Groundspeed" value={speed} onChange={setSpeed} placeholder="100" unit="kt" />}
      {mode !== "time" && <InputField label="Time" value={time} onChange={setTime} placeholder="45" unit="min" />}
      {mode !== "distance" && <InputField label="Distance" value={distance} onChange={setDistance} placeholder="75" unit="NM" />}
      <CalcButton onClick={calculate} />
      {result && (
        <>
          <ResultBox label={mode === "distance" ? "Distance" : mode === "speed" ? "Groundspeed" : "Time"} value={result.value} unit={mode === "distance" ? "NM" : mode === "speed" ? "kt" : "min"} />
          <div style={{ padding: "12px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Working</div>
            {result.working.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

function FuelCalculator() {
  const [mode, setMode] = useState<"required" | "rate" | "endurance">("required");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [fuel, setFuel] = useState("");
  const [result, setResult] = useState<{ value: number; unit: string; working: { step: string; formula?: string; result?: string }[] } | null>(null);

  const calculate = () => {
    if (mode === "required" && rate && time) {
      const r = parseFloat(rate);
      const t = parseFloat(time);
      const f = (r * t) / 60;
      setResult({ value: Math.round(f * 10) / 10, unit: "L", working: [
        { step: "Fuel Required = Rate × Time", formula: `F = ${r} L/hr × ${t} min ÷ 60` },
        { step: "Result", result: `${Math.round(f * 10) / 10} L` },
      ]});
    } else if (mode === "rate" && fuel && time) {
      const f = parseFloat(fuel);
      const t = parseFloat(time);
      const r = (f / t) * 60;
      setResult({ value: Math.round(r * 10) / 10, unit: "L/hr", working: [
        { step: "Fuel Rate = Fuel ÷ Time × 60", formula: `R = ${f} L ÷ ${t} min × 60` },
        { step: "Result", result: `${Math.round(r * 10) / 10} L/hr` },
      ]});
    } else if (mode === "endurance" && fuel && rate) {
      const f = parseFloat(fuel);
      const r = parseFloat(rate);
      const t = (f / r) * 60;
      const hrs = Math.floor(t / 60);
      const mins = Math.round(t % 60);
      setResult({ value: Math.round(t * 10) / 10, unit: "min", working: [
        { step: "Endurance = Fuel ÷ Rate × 60", formula: `T = ${f} L ÷ ${r} L/hr × 60` },
        { step: "Result", result: `${Math.round(t * 10) / 10} min (${hrs}h ${mins}m)` },
      ]});
    }
  };

  const modeOptions = [
    { id: "required" as const, label: "Fuel Required" },
    { id: "rate" as const, label: "Fuel Rate" },
    { id: "endurance" as const, label: "Endurance" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {modeOptions.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setResult(null); }}
            style={{ padding: "6px 14px", borderRadius: 100, border: `1px solid ${mode === m.id ? "#00D4AA" : "rgba(255,255,255,0.08)"}`, background: mode === m.id ? "rgba(0,212,170,0.1)" : "transparent", color: mode === m.id ? "#00D4AA" : "#6B7B8D", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {m.label}
          </button>
        ))}
      </div>
      {mode !== "rate" && <InputField label="Fuel burn rate" value={rate} onChange={setRate} placeholder="36" unit="L/hr" />}
      {mode !== "endurance" && <InputField label="Time" value={time} onChange={setTime} placeholder="90" unit="min" />}
      {mode !== "required" && <InputField label="Fuel available" value={fuel} onChange={setFuel} placeholder="120" unit="L" />}
      <CalcButton onClick={calculate} />
      {result && (
        <>
          <ResultBox label={mode === "required" ? "Fuel Required" : mode === "rate" ? "Fuel Rate" : "Endurance"} value={result.value} unit={result.unit} />
          <div style={{ padding: "12px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Working</div>
            {result.working.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

function WindTriangle() {
  const [tc, setTc] = useState("");
  const [tas, setTas] = useState("");
  const [windDir, setWindDir] = useState("");
  const [windSpd, setWindSpd] = useState("");
  const [result, setResult] = useState<{ heading: number; gs: number; wca: number; working: { step: string; formula?: string; result?: string }[] } | null>(null);

  const calculate = () => {
    if (!tc || !tas || !windDir || !windSpd) return;
    const tcVal = parseFloat(tc);
    const tasVal = parseFloat(tas);
    const wdVal = parseFloat(windDir);
    const wsVal = parseFloat(windSpd);

    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    // Wind angle relative to track
    const windAngle = toRad(wdVal - tcVal);

    // Wind correction angle (crosswind component)
    const xWind = wsVal * Math.sin(windAngle);
    const wcaRad = Math.asin(Math.min(1, Math.max(-1, xWind / tasVal)));
    const wca = toDeg(wcaRad);

    // Heading
    let heading = tcVal + wca;
    if (heading < 0) heading += 360;
    if (heading >= 360) heading -= 360;

    // Groundspeed
    const headWind = wsVal * Math.cos(windAngle);
    const gs = tasVal * Math.cos(wcaRad) - headWind;

    setResult({
      heading: Math.round(heading),
      gs: Math.round(gs),
      wca: Math.round(wca * 10) / 10,
      working: [
        { step: "1. Calculate wind angle relative to track", formula: `Wind angle = ${wdVal}° - ${tcVal}° = ${Math.round(wdVal - tcVal)}°` },
        { step: "2. Find crosswind component", formula: `X-wind = ${wsVal} × sin(${Math.round(wdVal - tcVal)}°) = ${Math.round(xWind * 10) / 10} kt` },
        { step: "3. Calculate wind correction angle (WCA)", formula: `WCA = arcsin(${Math.round(xWind * 10) / 10} ÷ ${tasVal}) = ${Math.round(wca * 10) / 10}°` },
        { step: "4. Find heading", result: `HDG = ${tcVal}° + ${Math.round(wca * 10) / 10}° = ${Math.round(heading)}°` },
        { step: "5. Calculate headwind component", formula: `H-wind = ${wsVal} × cos(${Math.round(wdVal - tcVal)}°) = ${Math.round(headWind * 10) / 10} kt` },
        { step: "6. Find groundspeed", result: `GS = ${tasVal} × cos(${Math.round(wca * 10) / 10}°) - (${Math.round(headWind * 10) / 10}) = ${Math.round(gs)} kt` },
      ],
    });
  };

  return (
    <div>
      <InputField label="Track (true)" value={tc} onChange={setTc} placeholder="270" unit="°" />
      <InputField label="TAS" value={tas} onChange={setTas} placeholder="105" unit="kt" />
      <InputField label="Wind direction (from)" value={windDir} onChange={setWindDir} placeholder="320" unit="°" />
      <InputField label="Wind speed" value={windSpd} onChange={setWindSpd} placeholder="20" unit="kt" />
      <CalcButton onClick={calculate} />
      {result && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
            <ResultBox label="Heading" value={`${result.heading}°`} />
            <ResultBox label="Groundspeed" value={result.gs} unit="kt" />
            <ResultBox label="WCA" value={`${result.wca > 0 ? "+" : ""}${result.wca}°`} color={result.wca > 0 ? "#F6BB42" : "#5D9CEC"} />
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Working</div>
            {result.working.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

function DensityAltitude() {
  const [elevation, setElevation] = useState("");
  const [qnh, setQnh] = useState("");
  const [oat, setOat] = useState("");
  const [result, setResult] = useState<{ pa: number; da: number; isa: number; working: { step: string; formula?: string; result?: string }[] } | null>(null);

  const calculate = () => {
    if (!elevation || !qnh || !oat) return;
    const elev = parseFloat(elevation);
    const qnhVal = parseFloat(qnh);
    const oatVal = parseFloat(oat);

    // Pressure altitude
    const pa = elev + (1013 - qnhVal) * 30;

    // ISA temperature at pressure altitude
    const isa = 15 - (pa / 1000) * 2;

    // ISA deviation
    const isaDev = oatVal - isa;

    // Density altitude
    const da = pa + isaDev * 120;

    setResult({
      pa: Math.round(pa),
      da: Math.round(da),
      isa: Math.round(isa * 10) / 10,
      working: [
        { step: "1. Calculate pressure altitude", formula: `PA = ${elev} + (1013 - ${qnhVal}) × 30` },
        { step: "", result: `PA = ${elev} + ${Math.round((1013 - qnhVal) * 30)} = ${Math.round(pa)} ft` },
        { step: "2. Find ISA temperature at pressure altitude", formula: `ISA = 15 - (${Math.round(pa)} ÷ 1000) × 2` },
        { step: "", result: `ISA = ${Math.round(isa * 10) / 10}°C` },
        { step: "3. Calculate ISA deviation", formula: `Deviation = ${oatVal}°C - ${Math.round(isa * 10) / 10}°C = ${isaDev > 0 ? "+" : ""}${Math.round(isaDev * 10) / 10}°C` },
        { step: "4. Calculate density altitude", formula: `DA = ${Math.round(pa)} + (${Math.round(isaDev * 10) / 10} × 120)` },
        { step: "", result: `DA = ${Math.round(da)} ft` },
      ],
    });
  };

  return (
    <div>
      <InputField label="Aerodrome elevation" value={elevation} onChange={setElevation} placeholder="2435" unit="ft" />
      <InputField label="QNH" value={qnh} onChange={setQnh} placeholder="1013" unit="hPa" />
      <InputField label="Outside air temperature (OAT)" value={oat} onChange={setOat} placeholder="30" unit="°C" />
      <CalcButton onClick={calculate} />
      {result && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <ResultBox label="Pressure Altitude" value={result.pa} unit="ft" color="#5D9CEC" />
            <ResultBox label="Density Altitude" value={result.da} unit="ft" />
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Working</div>
            {result.working.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

function TASCalculator() {
  const [cas, setCas] = useState("");
  const [pa, setPa] = useState("");
  const [oat, setOat] = useState("");
  const [result, setResult] = useState<{ tas: number; working: { step: string; formula?: string; result?: string }[] } | null>(null);

  const calculate = () => {
    if (!cas || !pa || !oat) return;
    const casVal = parseFloat(cas);
    const paVal = parseFloat(pa);
    const oatVal = parseFloat(oat);

    // ISA temp at PA
    const isa = 15 - (paVal / 1000) * 2;
    const isaDev = oatVal - isa;

    // Approximate TAS correction: +2% per 1000ft PA + adjustment for ISA dev
    // More accurate formula using air density ratio
    const tempK = oatVal + 273.15;
    const isaK = isa + 273.15;

    // Simple E6B approximation: TAS = CAS × (1 + PA/500/100) adjusted for temp
    // Better: TAS ≈ CAS + (CAS × PA / 60000) + (CAS × ISAdev × PA / 10000000)
    // Most accurate simple formula: TAS = CAS × sqrt((OAT+273)/(ISA+273)) × (1 + PA/20000)^(roughly)
    // Using the standard approximation: +2% per 1000ft
    const pctCorrection = paVal / 1000 * 2;
    const tempCorrection = isaDev * 0.5; // rough temp adjustment %
    const tas = casVal * (1 + (pctCorrection + tempCorrection) / 100);

    setResult({
      tas: Math.round(tas),
      working: [
        { step: "1. Find ISA temperature at pressure altitude", formula: `ISA = 15 - (${paVal} ÷ 1000) × 2 = ${Math.round(isa * 10) / 10}°C` },
        { step: "2. Calculate ISA deviation", formula: `Deviation = ${oatVal}°C - ${Math.round(isa * 10) / 10}°C = ${isaDev > 0 ? "+" : ""}${Math.round(isaDev * 10) / 10}°C` },
        { step: "3. Altitude correction (+2% per 1,000 ft PA)", formula: `${Math.round(pctCorrection * 10) / 10}% for ${paVal} ft` },
        { step: "4. Temperature correction", formula: `${isaDev > 0 ? "+" : ""}${Math.round(tempCorrection * 10) / 10}% for ${isaDev > 0 ? "+" : ""}${Math.round(isaDev * 10) / 10}°C deviation` },
        { step: "5. Apply correction to CAS", formula: `TAS = ${casVal} × (1 + ${Math.round((pctCorrection + tempCorrection) * 10) / 10}%)` },
        { step: "", result: `TAS ≈ ${Math.round(tas)} kt` },
      ],
    });
  };

  return (
    <div>
      <InputField label="CAS / IAS" value={cas} onChange={setCas} placeholder="105" unit="kt" />
      <InputField label="Pressure altitude" value={pa} onChange={setPa} placeholder="5000" unit="ft" />
      <InputField label="Outside air temperature (OAT)" value={oat} onChange={setOat} placeholder="5" unit="°C" />
      <CalcButton onClick={calculate} />
      {result && (
        <>
          <ResultBox label="True Airspeed (TAS)" value={result.tas} unit="kt" />
          <div style={{ padding: "12px 16px", borderRadius: 12, background: "#131F33", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Working</div>
            {result.working.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

function Conversions() {
  const conversions = [
    { label: "Nautical Miles → Kilometres", from: "NM", to: "km", factor: 1.852 },
    { label: "Kilometres → Nautical Miles", from: "km", to: "NM", factor: 1 / 1.852 },
    { label: "Statute Miles → Nautical Miles", from: "SM", to: "NM", factor: 1 / 1.151 },
    { label: "Nautical Miles → Statute Miles", from: "NM", to: "SM", factor: 1.151 },
    { label: "Feet → Metres", from: "ft", to: "m", factor: 0.3048 },
    { label: "Metres → Feet", from: "m", to: "ft", factor: 3.28084 },
    { label: "Litres → US Gallons", from: "L", to: "USG", factor: 0.26417 },
    { label: "US Gallons → Litres", from: "USG", to: "L", factor: 3.78541 },
    { label: "Litres → Imp Gallons", from: "L", to: "IG", factor: 0.21997 },
    { label: "Kilograms → Pounds", from: "kg", to: "lb", factor: 2.20462 },
    { label: "Pounds → Kilograms", from: "lb", to: "kg", factor: 0.45359 },
    { label: "°C → °F", from: "°C", to: "°F", factor: 0, special: "ctof" },
    { label: "°F → °C", from: "°F", to: "°C", factor: 0, special: "ftoc" },
    { label: "hPa → inHg", from: "hPa", to: "inHg", factor: 0.02953 },
    { label: "inHg → hPa", from: "inHg", to: "hPa", factor: 33.8639 },
  ];

  const [selected, setSelected] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const convert = () => {
    if (!input) return;
    const val = parseFloat(input);
    const conv = conversions[selected];
    let output: number;
    if (conv.special === "ctof") {
      output = val * 9 / 5 + 32;
    } else if (conv.special === "ftoc") {
      output = (val - 32) * 5 / 9;
    } else {
      output = val * conv.factor;
    }
    setResult(`${Math.round(output * 100) / 100} ${conv.to}`);
  };

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: "#6B7B8D", display: "block", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Conversion type</label>
        <select
          value={selected}
          onChange={e => { setSelected(parseInt(e.target.value)); setResult(null); }}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)", background: "#0F1D2F",
            color: "#FFF", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            outline: "none", appearance: "none",
          }}
        >
          {conversions.map((c, i) => (
            <option key={i} value={i}>{c.label}</option>
          ))}
        </select>
      </div>
      <InputField label={`Value in ${conversions[selected].from}`} value={input} onChange={setInput} placeholder="0" unit={conversions[selected].from} />
      <CalcButton onClick={convert} />
      {result && <ResultBox label="Result" value={result} />}
    </div>
  );
}

export default function E6BPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CalcTab>("tsd");
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
        <div style={{ marginBottom: 8 }}>
          <a href="/resources" style={{ fontSize: 13, color: "#4A5568", textDecoration: "none" }}>← Resources</a>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>
            E6B Flight Computer
          </h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            Digital flight calculator with step-by-step working. Select a calculation type below.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "8px 16px", borderRadius: 10,
                border: `1px solid ${activeTab === t.id ? "#00D4AA" : "rgba(255,255,255,0.08)"}`,
                background: activeTab === t.id ? "rgba(0,212,170,0.08)" : "#131F33",
                color: activeTab === t.id ? "#00D4AA" : "#6B7B8D",
                fontSize: 13, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontWeight: activeTab === t.id ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Calculator body */}
        <div className="quiz-card" style={{ padding: "24px 20px" }}>
          {activeTab === "tsd" && <TSDCalculator />}
          {activeTab === "fuel" && <FuelCalculator />}
          {activeTab === "wind" && <WindTriangle />}
          {activeTab === "da" && <DensityAltitude />}
          {activeTab === "tas" && <TASCalculator />}
          {activeTab === "conversions" && <Conversions />}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#4A5568" }}>
            This calculator is a study aid. Always verify calculations with your physical E6B for flight planning.
          </p>
        </div>
      </div>
    </div>
  );
}
