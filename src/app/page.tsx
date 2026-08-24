export default function ComingSoonPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-mark.svg"
          alt=""
          width={56}
          height={56}
          style={{ display: "block", margin: "0 auto 20px" }}
        />
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "-0.01em",
            color: "#0E2A4D",
            margin: "0 0 10px",
          }}
        >
          Shelter Cove
        </h1>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#1D63E0",
            margin: 0,
          }}
        >
          Coming soon
        </p>
      </div>
    </main>
  );
}
