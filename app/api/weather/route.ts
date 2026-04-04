import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const icao = searchParams.get("icao");
  const type = searchParams.get("type") || "metar"; // metar or taf

  if (!icao || !/^[A-Z]{4}$/.test(icao)) {
    return NextResponse.json({ error: "Invalid ICAO code" }, { status: 400 });
  }

  const endpoint = type === "taf" ? "taf" : "metar";
  const url = `https://aviationweather.gov/api/data/${endpoint}?ids=${icao}&format=raw&hours=24`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Vectored/1.0 (vectored.com.au)" },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Weather service unavailable" }, { status: 502 });
    }

    const text = await res.text();
    return NextResponse.json({ data: text.trim() || `No ${type.toUpperCase()} available for ${icao}` });
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
