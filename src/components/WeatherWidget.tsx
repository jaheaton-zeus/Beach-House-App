"use client";

import { useEffect, useState } from "react";
import type { ThemeColors } from "@/lib/theme";

type WeatherIconName = "sun" | "cloud" | "rain";

interface DayForecast {
  name: string;
  hi: number;
  lo: number | null;
  icon: WeatherIconName;
}

interface CurrentConditions {
  tempF: number | null;
  text: string;
  icon: WeatherIconName;
}

interface WeatherState {
  error?: boolean;
  current: CurrentConditions | null;
  days: DayForecast[];
}

interface NwsForecastPeriod {
  isDaytime: boolean;
  name: string;
  temperature: number;
  shortForecast: string;
}

interface NwsPointResponse {
  properties: { forecast: string; observationStations: string };
}

interface NwsStationsResponse {
  features: { properties: { stationIdentifier: string } }[];
}

interface NwsObservationResponse {
  properties: { temperature: { value: number | null }; textDescription: string };
}

interface NwsForecastResponse {
  properties: { periods: NwsForecastPeriod[] };
}

function iconFor(shortForecast = ""): WeatherIconName {
  const t = shortForecast.toLowerCase();
  if (t.includes("rain") || t.includes("shower") || t.includes("storm") || t.includes("thunder")) return "rain";
  if (t.includes("cloud") || t.includes("overcast") || t.includes("fog")) return "cloud";
  return "sun";
}

function WeatherIcon({ icon, size = 18, color }: { icon: WeatherIconName; size?: number; color?: string }) {
  if (icon === "sun") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4.5" stroke={color || "#FFD166"} strokeWidth="1.8" />
        <path
          d="M12 2.5V5M12 19V21.5M21.5 12H19M5 12H2.5M18.6 5.4L16.9 7.1M7.1 16.9L5.4 18.6M18.6 18.6L16.9 16.9M7.1 7.1L5.4 5.4"
          stroke={color || "#FFD166"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (icon === "cloud") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M6 17H16C18 17 19.5 15.5 19.5 13.7C19.5 12 18.2 10.7 16.6 10.5C16.2 8 14 6 11.5 6C8.7 6 6.5 8.2 6.3 11C4.4 11.3 3 12.9 3 14.8C3 16 4.3 17 6 17Z"
          stroke={color || "rgba(255,255,255,0.75)"}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 14H15C17 14 18.5 12.6 18.5 10.9C18.5 9.3 17.3 8 15.7 7.8C15.3 5.5 13.2 3.7 10.9 3.7C8.3 3.7 6.2 5.7 6 8.3C4.2 8.6 3 10.1 3 11.9C3 13 4.3 14 6 14Z"
        stroke={color || "rgba(255,255,255,0.75)"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 18L7 20M12 18L11 20M16 18L15 20" stroke="#7FC7E8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Live conditions + 5-day outlook for Hilton Head Island, SC via the National Weather Service API (no key required).
export function WeatherWidget({ theme }: { theme: ThemeColors }) {
  const [weather, setWeather] = useState<WeatherState | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const pt = (await fetch("https://api.weather.gov/points/32.2163,-80.7526").then((r) =>
          r.json()
        )) as NwsPointResponse;
        const [forecastRes, stationsRes] = (await Promise.all([
          fetch(pt.properties.forecast).then((r) => r.json()),
          fetch(pt.properties.observationStations).then((r) => r.json()),
        ])) as [NwsForecastResponse, NwsStationsResponse];

        let current: CurrentConditions | null = null;
        const stationId = stationsRes.features?.[0]?.properties?.stationIdentifier;
        if (stationId) {
          const obs = (await fetch(`https://api.weather.gov/stations/${stationId}/observations/latest`).then((r) =>
            r.json()
          )) as NwsObservationResponse;
          const tempC: number | null = obs.properties?.temperature?.value ?? null;
          current = {
            tempF: tempC != null ? Math.round((tempC * 9) / 5 + 32) : null,
            text: obs.properties?.textDescription || "",
            icon: iconFor(obs.properties?.textDescription),
          };
        }

        const periods: NwsForecastPeriod[] = forecastRes.properties.periods;
        const days: DayForecast[] = periods
          .filter((p) => p.isDaytime)
          .slice(0, 5)
          .map((p) => ({ name: p.name.slice(0, 3), hi: p.temperature, icon: iconFor(p.shortForecast), lo: null }));
        const nights = periods.filter((p) => !p.isDaytime);
        days.forEach((d, i) => {
          d.lo = nights[i] ? nights[i].temperature : null;
        });

        if (alive) setWeather({ current, days });
      } catch {
        if (alive) setWeather({ error: true, current: null, days: [] });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={{ padding: "0 20px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: theme.text,
          borderRadius: 4,
          padding: "14px 18px",
          minHeight: 58,
        }}
      >
        {!weather ? (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Loading weather…</div>
        ) : weather.error ? (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Weather unavailable right now.</div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <WeatherIcon icon={weather.current?.icon || "sun"} size={30} />
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 26,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {weather.current?.tempF != null ? `${weather.current.tempF}°` : "—"}
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}> F</span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginTop: 2,
                  }}
                >
                  {weather.current?.text || "—"} · Hilton Head
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              {weather.days.map((w, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.55)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontWeight: 600,
                    }}
                  >
                    {w.name}
                  </div>
                  <WeatherIcon icon={w.icon} />
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#fff" }}>
                    {w.hi}°<span style={{ color: "rgba(255,255,255,0.45)" }}>{w.lo != null ? `/${w.lo}°` : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
