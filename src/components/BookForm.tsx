"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import { nightsBetween, fmtRange } from "@/lib/format";
import { Icons } from "@/lib/icons";
import { createReservation } from "@/app/actions";
import { Avatar, Btn, Card, IconBtn, Input, Screen, SectionLabel, Textarea, TopBar, FONT_DISPLAY, FONT_SANS } from "@/components/ui";

export function BookForm({
  theme,
  currentUserName,
  currentUserFamily,
  maxGuests,
  initialCheckIn,
  initialCheckOut,
}: {
  theme: ThemeColors;
  currentUserName: string;
  currentUserFamily: "Pierce" | "Thomas";
  maxGuests: number;
  initialCheckIn: string;
  initialCheckOut: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState<string[]>([currentUserName]);
  const [newGuest, setNewGuest] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  const addGuest = () => {
    if (newGuest.trim() && guests.length < maxGuests) {
      setGuests((g) => [...g, newGuest.trim()]);
      setNewGuest("");
    }
  };
  const removeGuest = (i: number) => i > 0 && setGuests((g) => g.filter((_, idx) => idx !== i));

  const submit = () => {
    setError("");
    startTransition(async () => {
      const result = await createReservation({ checkIn, checkOut, guests, notes });
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "60vh",
          background: theme.bg,
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: theme.accentSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: theme.accent,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L10 17L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: theme.text, marginBottom: 10, letterSpacing: "-0.01em" }}>
          Request sent
        </div>
        <div style={{ fontSize: 15, color: theme.textMuted, maxWidth: 280, lineHeight: 1.5, marginBottom: 28 }}>
          {fmtRange(checkIn, checkOut)} · {guests.length} guests
          <br />
          The family will see this and chime in.
        </div>
        <Btn onClick={() => router.push("/mytrips")} theme={theme} variant="primary" size="lg" full style={{ maxWidth: 280 }}>
          View my trips
        </Btn>
        <button
          onClick={() => router.push("/home")}
          style={{
            marginTop: 12,
            background: "none",
            border: "none",
            color: theme.textMuted,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: FONT_SANS,
          }}
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar
        title={step === 1 ? "When?" : "Who?"}
        subtitle={`Step ${step} of 2`}
        theme={theme}
        left={
          step > 1 ? (
            <IconBtn theme={theme} onClick={() => setStep(1)}>
              {Icons.back(theme.text)}
            </IconBtn>
          ) : (
            <IconBtn theme={theme} onClick={() => router.push("/home")}>
              {Icons.close(theme.text)}
            </IconBtn>
          )
        }
        right={
          step === 1 ? (
            <IconBtn theme={theme} onClick={() => router.push("/home")}>
              {Icons.close(theme.text)}
            </IconBtn>
          ) : undefined
        }
      />

      <div style={{ height: 2, background: theme.border, margin: "0 20px", borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${step * 50}%`,
            background: theme.accent,
            transition: "width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>

      <Screen>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 18, maxWidth: 520 }}>
          {step === 1 && (
            <>
              <Input label="Check-in" type="date" value={checkIn} onChange={setCheckIn} theme={theme} />
              <Input label="Check-out" type="date" value={checkOut} onChange={setCheckOut} theme={theme} />

              {nights > 0 && (
                <Card theme={theme} style={{ background: theme.accentSoft, border: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: theme.accent,
                          fontWeight: 600,
                          letterSpacing: "0.02em",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Your stay
                      </div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: theme.accentDeep, lineHeight: 1.1 }}>
                        {nights} night{nights > 1 ? "s" : ""}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: theme.accentDeep, opacity: 0.7, textAlign: "right" }}>
                      {fmtRange(checkIn, checkOut)}
                    </div>
                  </div>
                </Card>
              )}

              <Btn onClick={() => setStep(2)} disabled={!checkIn || !checkOut || nights < 1} theme={theme} variant="primary" size="lg" full>
                Continue
              </Btn>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <SectionLabel theme={theme}>
                  Guests · {guests.length}/{maxGuests}
                </SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {guests.map((g, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        background: theme.surface,
                        border: `0.5px solid ${theme.border}`,
                        borderRadius: 12,
                      }}
                    >
                      <Avatar
                        initials={g.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        size={28}
                        family={i === 0 ? currentUserFamily : undefined}
                      />
                      <span style={{ flex: 1, fontSize: 14, color: theme.text }}>
                        {g}
                        {i === 0 ? " (you)" : ""}
                      </span>
                      {i > 0 && (
                        <button
                          onClick={() => removeGuest(i)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: theme.textSubtle, padding: 4, display: "flex" }}
                        >
                          {Icons.close(theme.textSubtle)}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {guests.length < maxGuests && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      value={newGuest}
                      onChange={(e) => setNewGuest(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addGuest()}
                      placeholder="Add guest name"
                      style={{
                        flex: 1,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 12,
                        padding: "10px 14px",
                        fontSize: 14,
                        fontFamily: FONT_SANS,
                        background: theme.surface,
                        color: theme.text,
                        outline: "none",
                      }}
                    />
                    <Btn onClick={addGuest} theme={theme} variant="secondary" disabled={!newGuest.trim()}>
                      Add
                    </Btn>
                  </div>
                )}
              </div>

              <Textarea label="Note for the family (optional)" value={notes} onChange={setNotes} placeholder="Anything to share?" rows={3} theme={theme} />

              <Card theme={theme} style={{ background: theme.surfaceAlt, border: "none" }}>
                {(
                  [
                    ["Dates", fmtRange(checkIn, checkOut)],
                    ["Nights", String(nights)],
                    ["Guests", String(guests.length)],
                    ["Status", "Awaiting family"],
                  ] as [string, string][]
                ).map(([k, v], i, arr) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.border}` : "none",
                    }}
                  >
                    <span style={{ fontSize: 13, color: theme.textMuted }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{v}</span>
                  </div>
                ))}
              </Card>

              {error && <div style={{ fontSize: 13, color: theme.accentDeep }}>{error}</div>}

              <Btn onClick={submit} disabled={isPending} theme={theme} variant="accent" size="lg" full>
                {isPending ? "Sending…" : "Request stay"}
              </Btn>
            </>
          )}
        </div>
      </Screen>
    </div>
  );
}
