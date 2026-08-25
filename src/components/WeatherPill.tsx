"use client";

import { useEffect, useState } from "react";

type Weather = { temp: string; desc: string; day: boolean };

function iconFor(desc: string, day: boolean): string {
  const d = (desc || "").toLowerCase();
  if (d.includes("thunder") || d.includes("storm")) return "⛈️";
  if (d.includes("snow") || d.includes("sleet") || d.includes("ice")) return "❄️";
  if (d.includes("rain") || d.includes("shower") || d.includes("drizzle")) return "🌧️";
  if (d.includes("fog") || d.includes("haze")) return "🌫️";
  if (d.includes("cloud") || d.includes("overcast")) {
    return d.includes("partly") ? (day ? "⛅" : "☁️") : "☁️";
  }
  return day ? "☀️" : "🌙";
}

export function WeatherPill() {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((res) => (res.ok && res.status !== 204 ? (res.json() as Promise<Weather>) : null))
      .then((data) => {
        if (!cancelled && data) setWeather(data);
      })
      .catch(() => {
        /* pill stays hidden */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!weather) return null;

  return (
    <div className="sc-weather">
      {/* Icon last so it lands on the right edge with the text, rather than
          stranded on the far side of a right-aligned block. */}
      <div className="sc-weather__readout">
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{weather.temp}</div>
        <div style={{ fontSize: 10.5, letterSpacing: 0.3, color: "rgba(255,255,255,0.6)" }}>
          {weather.desc}
        </div>
      </div>
      <span style={{ fontSize: 20, lineHeight: 1 }}>{iconFor(weather.desc, weather.day)}</span>
    </div>
  );
}
