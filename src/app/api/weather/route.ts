/**
 * Current conditions for Hilton Head, for the header's weather pill.
 *
 * The prototype called api.weather.gov straight from the browser; doing it
 * server-side keeps the two-hop lookup off the client and lets us cache it.
 *
 * Both responses are typed explicitly rather than inferred: under the Workers
 * runtime types, `Response.json()` resolves to `unknown`, so an untyped
 * `fetch().then(r => r.json())` type-checks locally and then fails the real
 * Cloudflare build.
 */

type PointsResponse = { properties: { forecastHourly: string } };
type ForecastResponse = {
  properties: {
    periods: {
      temperature: number;
      temperatureUnit: string;
      shortForecast: string;
      isDaytime: boolean;
    }[];
  };
};

export type Weather = {
  temp: string;
  desc: string;
  day: boolean;
};

const POINT = "https://api.weather.gov/points/32.1896,-80.7501";
const HEADERS = {
  Accept: "application/geo+json",
  "User-Agent": "sheltercove-app (family beach house site)",
};

export async function GET(): Promise<Response> {
  try {
    const pointsRes = await fetch(POINT, { headers: HEADERS, next: { revalidate: 86400 } });
    if (!pointsRes.ok) throw new Error(`points ${pointsRes.status}`);
    const points = (await pointsRes.json()) as PointsResponse;

    const forecastRes = await fetch(points.properties.forecastHourly, {
      headers: HEADERS,
      next: { revalidate: 900 },
    });
    if (!forecastRes.ok) throw new Error(`forecast ${forecastRes.status}`);
    const forecast = (await forecastRes.json()) as ForecastResponse;

    const period = forecast.properties.periods[0];
    if (!period) throw new Error("no periods");

    const weather: Weather = {
      temp: `${period.temperature}°${period.temperatureUnit}`,
      desc: period.shortForecast,
      day: period.isDaytime,
    };

    return Response.json(weather, {
      headers: { "Cache-Control": "public, max-age=600" },
    });
  } catch {
    // The pill hides itself when this fails — weather is never worth an error.
    return new Response(null, { status: 204 });
  }
}
