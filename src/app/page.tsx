import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

async function getStatus() {
  const { env } = await getCloudflareContext({ async: true });
  const house = await env.DB
    .prepare("SELECT house_name, location FROM house_info WHERE id = 1")
    .first<{ house_name: string; location: string }>();
  const { count } = (await env.DB
    .prepare("SELECT COUNT(*) as count FROM reservations")
    .first<{ count: number }>())!;

  return { house, reservationCount: count };
}

export default async function Home() {
  const { house, reservationCount } = await getStatus();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F4EE",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#1F1B16",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          background: "#FFFFFF",
          border: "1px solid #E8E1D4",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#C96442",
            marginBottom: 12,
          }}
        >
          sheltercove.aheaton.com
        </div>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>
          {house?.house_name ?? "Shelter Cove"}
        </h1>
        <p style={{ color: "#7A6F62", marginBottom: 24 }}>
          {house?.location ?? "Hilton Head Island, SC"}
        </p>
        <div
          style={{
            borderTop: "1px solid #F0EAE0",
            paddingTop: 16,
            fontSize: 14,
            color: "#7A6F62",
          }}
        >
          D1 connection check: <strong style={{ color: "#1F1B16" }}>{reservationCount}</strong> reservations loaded from the database.
        </div>
      </div>
    </main>
  );
}
