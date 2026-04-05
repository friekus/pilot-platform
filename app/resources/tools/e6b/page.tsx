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

const tabsList: { id: CalcTab; label: string }[] = [
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

function WorkingStep({ explanation, formula }: { explanation: string; formula?: string }) {
  const [showFormula, setShowFormula] = useState(false);
  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      <div style={{ fontSize: 13, color: "#CCD6E0", lineHeight: 1.6 }}>{explanation}</div>
      {formula && (
        <>
          <button
            onClick={() => setShowFormula(!showFormula)}
            style={{
              fontSize: 11, color: "#4A5568", background: "none", border: "none",
              cursor: "pointer", padding: "4px 0", fontFamily: "'DM Sans', sans-serif",
              textDecoration: "underline", marginTop: 2,
            }}
          >
            {showFormula ? "Hide formula" : "Show formula"}
          </button>
          {showFormula && (
            <div style={{
              fontSize: 12, color: "#5D9CEC", fontFamily: "'DM Mono', 'SF Mono', monospace",
              marginTop: 4, padding: "6px 10px", borderRadius: 6,
              background: "rgba(93,156,236,0.06)", border: "1px solid rgba(93,156,236,0.1)",
            }}>
              {formula}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CalcButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="quiz-btn quiz-btn-primary" style={{ width: "100%", marginTop: 8, marginBottom: 16 }}>
      Calculate
    </button>
  );
}

// ============ TSD ============
function TSDCalculator() {
  const [mode, setMode] = useState<"distance" | "speed" | "time">("distance");
  const [speed, setSpeed] = useState("");
  const [time, setTime] = useState("");
  const [distance, setDistance] = useState("");
  const [result, setResult] = useState<{ value: number; steps: { explanation: string; formula?: string }[] } | null>(null);

  const calculate = () => {
    if (mode === "distance" && speed && time) {
      const s = parseFloat(speed); const t = parseFloat(time);
      const d = (s * t) / 60;
      setResult({ value: Math.round(d * 10) / 10, steps: [
        { explanation: `You're travelling at ${s} knots, which means you cover ${s} nautical miles every 60 minutes.` },
        { explanation: `In ${t} minutes, you cover ${s} × ${t} ÷ 60 = ${Math.round(d * 10) / 10} NM.`, formula: `Distance = Speed × Time ÷ 60 = ${s} × ${t} ÷ 60 = ${Math.round(d * 10) / 10} NM` },
      ]});
    } else if (mode === "speed" && distance && time) {
      const d = parseFloat(distance); const t = parseFloat(time);
      const s = (d / t) * 60;
      setResult({ value: Math.round(s * 10) / 10, steps: [
        { explanation: `You covered ${d} NM in ${t} minutes.` },
        { explanation: `To find speed, divide the distance by time and multiply by 60 to convert to knots (NM per hour): ${d} ÷ ${t} × 60 = ${Math.round(s * 10) / 10} kt.`, formula: `Speed = Distance ÷ Time × 60 = ${d} ÷ ${t} × 60 = ${Math.round(s * 10) / 10} kt` },
      ]});
    } else if (mode === "time" && speed && distance) {
      const s = parseFloat(speed); const d = parseFloat(distance);
      const t = (d / s) * 60;
      const hrs = Math.floor(t / 60); const mins = Math.round(t % 60);
      setResult({ value: Math.round(t * 10) / 10, steps: [
        { explanation: `You need to cover ${d} NM at a speed of ${s} knots.` },
        { explanation: `Divide the distance by speed, then multiply by 60 to get the time in minutes: ${d} ÷ ${s} × 60 = ${Math.round(t * 10) / 10} minutes${hrs > 0 ? ` (${hrs}h ${mins}m)` : ""}.`, formula: `Time = Distance ÷ Speed × 60 = ${d} ÷ ${s} × 60 = ${Math.round(t * 10) / 10} min` },
      ]});
    }
  };

  const modeOptions = [{ id: "distance" as const, label: "Find Distance" }, { id: "speed" as const, label: "Find Speed" }, { id: "time" as const, label: "Find Time" }];

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
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>How it works</div>
            {result.steps.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ============ FUEL ============
function FuelCalculator() {
  const [mode, setMode] = useState<"required" | "rate" | "endurance">("required");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [fuel, setFuel] = useState("");
  const [result, setResult] = useState<{ value: number; unit: string; steps: { explanation: string; formula?: string }[] } | null>(null);

  const calculate = () => {
    if (mode === "required" && rate && time) {
      const r = parseFloat(rate); const t = parseFloat(time);
      const f = (r * t) / 60;
      setResult({ value: Math.round(f * 10) / 10, unit: "L", steps: [
        { explanation: `Your aircraft burns ${r} litres per hour.` },
        { explanation: `Over ${t} minutes of flight, you'll use ${r} × ${t} ÷ 60 = ${Math.round(f * 10) / 10} litres.`, formula: `Fuel = Rate × Time ÷ 60 = ${r} × ${t} ÷ 60 = ${Math.round(f * 10) / 10} L` },
        { explanation: `Don't forget to add your fixed reserve (typically 30 minutes for day VFR) and variable reserve (10% of trip fuel) on top of this figure.` },
      ]});
    } else if (mode === "rate" && fuel && time) {
      const f = parseFloat(fuel); const t = parseFloat(time);
      const r = (f / t) * 60;
      setResult({ value: Math.round(r * 10) / 10, unit: "L/hr", steps: [
        { explanation: `You used ${f} litres over ${t} minutes of flight.` },
        { explanation: `Divide the fuel used by time, then multiply by 60 to get the hourly rate: ${f} ÷ ${t} × 60 = ${Math.round(r * 10) / 10} L/hr.`, formula: `Rate = Fuel ÷ Time × 60 = ${f} ÷ ${t} × 60 = ${Math.round(r * 10) / 10} L/hr` },
      ]});
    } else if (mode === "endurance" && fuel && rate) {
      const f = parseFloat(fuel); const r = parseFloat(rate);
      const t = (f / r) * 60;
      const hrs = Math.floor(t / 60); const mins = Math.round(t % 60);
      setResult({ value: Math.round(t * 10) / 10, unit: "min", steps: [
        { explanation: `You have ${f} litres of fuel and your aircraft burns ${r} litres per hour.` },
        { explanation: `Divide the available fuel by the burn rate, then multiply by 60 to get the endurance in minutes: ${f} ÷ ${r} × 60 = ${Math.round(t * 10) / 10} minutes (${hrs}h ${mins}m).`, formula: `Endurance = Fuel ÷ Rate × 60 = ${f} ÷ ${r} × 60 = ${Math.round(t * 10) / 10} min` },
        { explanation: `This is total endurance — your usable flight time will be less after subtracting your fixed and variable reserves.` },
      ]});
    }
  };

  const modeOptions = [{ id: "required" as const, label: "Fuel Required" }, { id: "rate" as const, label: "Fuel Rate" }, { id: "endurance" as const, label: "Endurance" }];

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
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>How it works</div>
            {result.steps.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ============ WIND TRIANGLE ============
function WindTriangle() {
  const [tc, setTc] = useState("");
  const [tas, setTas] = useState("");
  const [windDir, setWindDir] = useState("");
  const [windSpd, setWindSpd] = useState("");
  const [result, setResult] = useState<{ heading: number; gs: number; wca: number; steps: { explanation: string; formula?: string }[] } | null>(null);

  const calculate = () => {
    if (!tc || !tas || !windDir || !windSpd) return;
    const tcVal = parseFloat(tc); const tasVal = parseFloat(tas);
    const wdVal = parseFloat(windDir); const wsVal = parseFloat(windSpd);

    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    const windAngle = toRad(wdVal - tcVal);
    const xWind = wsVal * Math.sin(windAngle);
    const hWind = wsVal * Math.cos(windAngle);
    const wcaRad = Math.asin(Math.min(1, Math.max(-1, xWind / tasVal)));
    const wca = toDeg(wcaRad);

    let heading = tcVal + wca;
    if (heading < 0) heading += 360;
    if (heading >= 360) heading -= 360;

    const gs = tasVal * Math.cos(wcaRad) - hWind;

    const absXWind = Math.abs(Math.round(xWind * 10) / 10);
    const absWCA = Math.abs(Math.round(wca * 10) / 10);
    const xWindSide = xWind > 0 ? "right" : xWind < 0 ? "left" : "neither side";
    const wcaDir = wca > 0 ? "right (into the wind)" : wca < 0 ? "left (into the wind)" : "zero";
    const hWindType = hWind > 0 ? "headwind" : "tailwind";
    const absHWind = Math.abs(Math.round(hWind * 10) / 10);

    setResult({
      heading: Math.round(heading),
      gs: Math.round(gs),
      wca: Math.round(wca * 10) / 10,
      steps: [
        {
          explanation: `The wind is from ${wdVal}° and your desired track is ${tcVal}°. That means the wind is coming from ${Math.abs(Math.round(wdVal - tcVal))}° relative to your track — it's hitting you from the ${xWind > 0 ? "right" : xWind < 0 ? "left" : "nose"}.`,
          formula: `Wind angle = ${wdVal}° - ${tcVal}° = ${Math.round(wdVal - tcVal)}°`,
        },
        {
          explanation: `The crosswind component is ${absXWind} kt, pushing you to the ${xWindSide} of your intended track. This is calculated by multiplying the wind speed (${wsVal} kt) by the sine of the wind angle (${Math.round(wdVal - tcVal)}°).`,
          formula: `Crosswind = ${wsVal} × sin(${Math.round(wdVal - tcVal)}°) = ${Math.round(xWind * 10) / 10} kt`,
        },
        {
          explanation: `To correct for this crosswind and stay on track, you need to point the nose ${absWCA}° to the ${wca > 0 ? "right" : "left"}. This is your Wind Correction Angle (WCA). It's found by dividing the crosswind component (${absXWind} kt) by your TAS (${tasVal} kt), then taking the inverse sine of that ratio.`,
          formula: `WCA = arcsin(${Math.round(xWind * 10) / 10} ÷ ${tasVal}) = ${Math.round(wca * 10) / 10}°`,
        },
        {
          explanation: `Your heading is your track (${tcVal}°) plus the WCA (${Math.round(wca * 10) / 10}°) = ${Math.round(heading)}°. This is the direction you need to point the aircraft to maintain a track of ${tcVal}°.`,
          formula: `Heading = ${tcVal}° + (${Math.round(wca * 10) / 10}°) = ${Math.round(heading)}°`,
        },
        {
          explanation: `The ${hWindType} component is ${absHWind} kt. This is calculated by multiplying the wind speed (${wsVal} kt) by the cosine of the wind angle. A positive value means ${hWindType === "headwind" ? "the wind is slowing you down" : "the wind is pushing you along"}.`,
          formula: `${hWindType === "headwind" ? "Headwind" : "Tailwind"} = ${wsVal} × cos(${Math.round(wdVal - tcVal)}°) = ${Math.round(hWind * 10) / 10} kt`,
        },
        {
          explanation: `Your groundspeed is ${Math.round(gs)} kt. This is your TAS (${tasVal} kt) adjusted for the heading correction and ${hWindType === "headwind" ? "reduced by" : "increased by"} the ${absHWind} kt ${hWindType}.`,
          formula: `GS = ${tasVal} × cos(${Math.round(wca * 10) / 10}°) - (${Math.round(hWind * 10) / 10}) = ${Math.round(gs)} kt`,
        },
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
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>How it works</div>
            {result.steps.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ============ DENSITY ALTITUDE ============
function DensityAltitude() {
  const [elevation, setElevation] = useState("");
  const [qnh, setQnh] = useState("");
  const [oat, setOat] = useState("");
  const [result, setResult] = useState<{ pa: number; da: number; steps: { explanation: string; formula?: string }[] } | null>(null);

  const calculate = () => {
    if (!elevation || !qnh || !oat) return;
    const elev = parseFloat(elevation); const qnhVal = parseFloat(qnh); const oatVal = parseFloat(oat);

    const pa = elev + (1013 - qnhVal) * 30;
    const isa = 15 - (pa / 1000) * 2;
    const isaDev = oatVal - isa;
    const da = pa + isaDev * 120;

    setResult({ pa: Math.round(pa), da: Math.round(da), steps: [
      {
        explanation: `First, find the pressure altitude. The standard pressure is 1013 hPa. Your QNH is ${qnhVal} hPa, which is ${Math.round(1013 - qnhVal)} hPa ${qnhVal < 1013 ? "below" : qnhVal > 1013 ? "above" : "at"} standard. Each 1 hPa difference equals 30 feet, so the pressure correction is ${Math.abs(Math.round((1013 - qnhVal) * 30))} ft ${qnhVal < 1013 ? "added to" : "subtracted from"} your elevation.`,
        formula: `PA = ${elev} + (1013 - ${qnhVal}) × 30 = ${elev} + ${Math.round((1013 - qnhVal) * 30)} = ${Math.round(pa)} ft`,
      },
      {
        explanation: `Next, find what the temperature should be at this pressure altitude according to the International Standard Atmosphere (ISA). ISA temperature decreases by 2°C for every 1,000 ft above sea level, starting from 15°C at sea level. At ${Math.round(pa)} ft, ISA temperature is ${Math.round(isa * 10) / 10}°C.`,
        formula: `ISA temp = 15 - (${Math.round(pa)} ÷ 1000) × 2 = ${Math.round(isa * 10) / 10}°C`,
      },
      {
        explanation: `The actual outside air temperature is ${oatVal}°C, which is ${Math.abs(Math.round(isaDev * 10) / 10)}°C ${isaDev > 0 ? "warmer" : "cooler"} than ISA. This is called the ISA deviation. ${isaDev > 0 ? "Warmer air is less dense, so the aircraft performs as if it were at a higher altitude." : isaDev < 0 ? "Cooler air is more dense, so the aircraft performs as if it were at a lower altitude." : "The air density matches standard conditions."}`,
        formula: `ISA deviation = ${oatVal}°C - ${Math.round(isa * 10) / 10}°C = ${isaDev > 0 ? "+" : ""}${Math.round(isaDev * 10) / 10}°C`,
      },
      {
        explanation: `Finally, calculate density altitude by adding 120 ft for every 1°C of ISA deviation to the pressure altitude. The density altitude is ${Math.round(da)} ft — this is the altitude the aircraft "thinks" it's at in terms of performance.`,
        formula: `DA = ${Math.round(pa)} + (${Math.round(isaDev * 10) / 10} × 120) = ${Math.round(da)} ft`,
      },
    ]});
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
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>How it works</div>
            {result.steps.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ============ TAS ============
function TASCalculator() {
  const [cas, setCas] = useState("");
  const [pa, setPa] = useState("");
  const [oat, setOat] = useState("");
  const [result, setResult] = useState<{ tas: number; steps: { explanation: string; formula?: string }[] } | null>(null);

  const calculate = () => {
    if (!cas || !pa || !oat) return;
    const casVal = parseFloat(cas); const paVal = parseFloat(pa); const oatVal = parseFloat(oat);

    const isa = 15 - (paVal / 1000) * 2;
    const isaDev = oatVal - isa;
    const pctCorrection = paVal / 1000 * 2;
    const tempCorrection = isaDev * 0.5;
    const totalCorrection = pctCorrection + tempCorrection;
    const tas = casVal * (1 + totalCorrection / 100);

    setResult({ tas: Math.round(tas), steps: [
      {
        explanation: `As altitude increases, air becomes less dense. Your airspeed indicator reads CAS (${casVal} kt), but the aircraft is actually moving faster through the thinner air. We need to correct for this to find the True Airspeed (TAS).`,
      },
      {
        explanation: `At ${paVal} ft pressure altitude, the ISA temperature would be ${Math.round(isa * 10) / 10}°C. Your actual OAT is ${oatVal}°C, which is ${Math.abs(Math.round(isaDev * 10) / 10)}°C ${isaDev > 0 ? "warmer" : "cooler"} than ISA.`,
        formula: `ISA = 15 - (${paVal} ÷ 1000) × 2 = ${Math.round(isa * 10) / 10}°C | Deviation = ${isaDev > 0 ? "+" : ""}${Math.round(isaDev * 10) / 10}°C`,
      },
      {
        explanation: `The altitude correction is approximately +2% per 1,000 ft of pressure altitude. At ${paVal} ft, that's +${Math.round(pctCorrection * 10) / 10}%. ${isaDev !== 0 ? `The temperature deviation adds another ${isaDev > 0 ? "+" : ""}${Math.round(tempCorrection * 10) / 10}% (about 0.5% per °C of ISA deviation).` : "The temperature is ISA standard, so no additional correction."}`,
        formula: `Altitude correction: +${Math.round(pctCorrection * 10) / 10}% | Temp correction: ${isaDev > 0 ? "+" : ""}${Math.round(tempCorrection * 10) / 10}% | Total: +${Math.round(totalCorrection * 10) / 10}%`,
      },
      {
        explanation: `Applying the total correction of +${Math.round(totalCorrection * 10) / 10}% to your CAS of ${casVal} kt gives a TAS of approximately ${Math.round(tas)} kt.`,
        formula: `TAS = ${casVal} × (1 + ${Math.round(totalCorrection * 10) / 10}%) = ${Math.round(tas)} kt`,
      },
    ]});
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
            <div style={{ fontSize: 11, color: "#4A5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>How it works</div>
            {result.steps.map((w, i) => <WorkingStep key={i} {...w} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ============ CONVERSIONS ============
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
    { label: "°C → °F", from: "°C", to: "°F", factor: 0, special: "ctof" as const },
    { label: "°F → °C", from: "°F", to: "°C", factor: 0, special: "ftoc" as const },
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
    if (conv.special === "ctof") { output = val * 9 / 5 + 32; }
    else if (conv.special === "ftoc") { output = (val - 32) * 5 / 9; }
    else { output = val * conv.factor; }
    setResult(`${Math.round(output * 100) / 100} ${conv.to}`);
  };

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: "#6B7B8D", display: "block", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Conversion type</label>
        <select value={selected} onChange={e => { setSelected(parseInt(e.target.value)); setResult(null); }}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#0F1D2F", color: "#FFF", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", appearance: "none" }}>
          {conversions.map((c, i) => (<option key={i} value={i}>{c.label}</option>))}
        </select>
      </div>
      <InputField label={`Value in ${conversions[selected].from}`} value={input} onChange={setInput} placeholder="0" unit={conversions[selected].from} />
      <CalcButton onClick={convert} />
      {result && <ResultBox label="Result" value={result} />}
    </div>
  );
}

// ============ MAIN PAGE ============
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
    return (<div className="quiz-root"><div className="quiz-container"><div className="quiz-loading"><div className="quiz-spinner"></div><p>Loading...</p></div></div></div>);
  }

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />
      <nav className="quiz-nav">
        <a href="/dashboard" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#6B7B8D", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Log out</button>
        </div>
      </nav>
      <div className="quiz-container">
        <div style={{ marginBottom: 8 }}>
          <a href="/resources" style={{ fontSize: 13, color: "#4A5568", textDecoration: "none" }}>← Resources</a>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>E6B Flight Computer</h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>Digital flight calculator with step-by-step explanations. Select a calculation type below.</p>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {tabsList.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${activeTab === t.id ? "#00D4AA" : "rgba(255,255,255,0.08)"}`, background: activeTab === t.id ? "rgba(0,212,170,0.08)" : "#131F33", color: activeTab === t.id ? "#00D4AA" : "#6B7B8D", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: activeTab === t.id ? 600 : 400 }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="quiz-card" style={{ padding: "24px 20px" }}>
          {activeTab === "tsd" && <TSDCalculator />}
          {activeTab === "fuel" && <FuelCalculator />}
          {activeTab === "wind" && <WindTriangle />}
          {activeTab === "da" && <DensityAltitude />}
          {activeTab === "tas" && <TASCalculator />}
          {activeTab === "conversions" && <Conversions />}
        </div>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#4A5568" }}>This calculator is a study aid. Always verify calculations with your physical E6B for flight planning.</p>
        </div>
      </div>
    </div>
  );
}
