import { NextRequest, NextResponse } from "next/server";

async function fetchFromBOM(icao: string, type: "metar" | "taf"): Promise<string> {
  const page = type === "taf" ? "TAF" : "METAR";
  const res = await fetch("http://www.bom.gov.au/aviation/php/process.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "*/*",
      "Origin": "http://www.bom.gov.au",
    },
    body: `keyword=${icao}&type=search&page=${page}`,
  });

  if (!res.ok) throw new Error("BOM request failed");

  const html = await res.text();

  // Extract the report from the HTML response
  // BOM returns HTML with the report inside <p> tags
  // For TAF the report is in the 2nd <p>, for METAR it's in the 3rd <p>
  const parts = html.split("<p");
  const targetIndex = type === "taf" ? 1 : 2;

  if (parts.length > targetIndex) {
    let report = parts[targetIndex];
    // Remove the opening tag
    report = report.substring(report.indexOf(">") + 1);
    // Remove closing tag and everything after
    report = report.split("</p")[0];
    // Clean up HTML entities and tags
    report = report.replace(/<br\s*\/?>/gi, "\n");
    report = report.replace(/<[^>]*>/g, "");
    report = report.replace(/&amp;/g, "&");
    report = report.replace(/&lt;/g, "<");
    report = report.replace(/&gt;/g, ">");
    report = report.replace(/&#?\w+;/g, "");
    report = report.trim();

    if (report.length > 5) return report;
  }

  return "";
}

async function fetchFromAviationWeather(icao: string, type: "metar" | "taf"): Promise<string> {
  const url = `https://aviationweather.gov/api/data/${type}?ids=${icao}&format=raw&hours=6`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Vectored/1.0 (vectored.com.au)" },
  });

  if (!res.ok) return "";

  const text = await res.text();
  // Only return the most recent report (first line)
  const firstReport = text.trim().split("\n")[0];
  return firstReport || "";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const icao = searchParams.get("icao");
  const type = (searchParams.get("type") || "metar") as "metar" | "taf";

  if (!icao || !/^[A-Z]{4}$/.test(icao)) {
    return NextResponse.json({ error: "Invalid ICAO code" }, { status: 400 });
  }

  try {
    let data = "";

    // Use BOM for Australian aerodromes (ICAO starts with Y)
    if (icao.startsWith("Y")) {
      try {
        data = await fetchFromBOM(icao, type);
      } catch {
        // Fall back to aviationweather.gov if BOM fails
        data = await fetchFromAviationWeather(icao, type);
      }
    } else {
      data = await fetchFromAviationWeather(icao, type);
    }

    if (!data) {
      return NextResponse.json({ data: `No ${type.toUpperCase()} available for ${icao}` });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
