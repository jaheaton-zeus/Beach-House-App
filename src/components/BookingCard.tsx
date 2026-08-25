"use client";

import { useActionState, useState } from "react";

import { requestBooking, type BookingResult } from "@/app/actions";
import { nightsLabel } from "@/lib/format";
import { CalendarCheckIcon, CalendarIcon, GuestsIcon } from "@/lib/icons";

import { InlineMessage } from "./ui";

/** The "Schedule Your Stay" card in the home hero. */
export function BookingCard() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(4);
  const [state, formAction, pending] = useActionState<BookingResult, FormData>(
    requestBooking,
    null
  );

  return (
    <form action={formAction} className="sc-glass sc-booking" style={{ padding: "26px 24px" }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 600 }}>
        Schedule Your Stay
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "4px 0 22px" }}>
        Reserve your dates at the beach house
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <label className="sc-field-label" htmlFor="booking-checkin">
            <CalendarIcon />
            Check-in
          </label>
          <input
            id="booking-checkin"
            name="checkIn"
            type="date"
            className="sc-input sc-input--date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label className="sc-field-label" htmlFor="booking-checkout">
            <CalendarCheckIcon />
            Check-out
          </label>
          <input
            id="booking-checkout"
            name="checkOut"
            type="date"
            className="sc-input sc-input--date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(111,167,147,0.1)",
          border: "1px solid rgba(111,167,147,0.25)",
          borderRadius: 11,
          padding: "10px 14px",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)" }}>Length of stay</span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--accent)" }}>
          {nightsLabel(checkIn, checkOut)}
        </span>
      </div>

      <div className="sc-field-label">Guests</div>
      <div className="sc-stepper" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GuestsIcon />
          <span style={{ fontSize: 14.5, fontWeight: 600 }}>
            {guests} {guests === 1 ? "Guest" : "Guests"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className="sc-iconbtn sc-iconbtn--sm"
            aria-label="Fewer guests"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
          >
            −
          </button>
          <button
            type="button"
            className="sc-iconbtn sc-iconbtn--sm"
            aria-label="More guests"
            onClick={() => setGuests((g) => Math.min(6, g + 1))}
          >
            +
          </button>
        </div>
        <input type="hidden" name="guests" value={guests} />
      </div>

      <label className="sc-field-label" htmlFor="booking-code">
        Reservation code
      </label>
      <input
        id="booking-code"
        name="code"
        type="text"
        className="sc-input sc-input--code"
        placeholder="e.g. PIERCE7"
        style={{ marginBottom: 16 }}
      />

      {state ? (
        <InlineMessage kind={state.ok ? "ok" : "err"} style={{ marginBottom: 14 }}>
          {state.message}
        </InlineMessage>
      ) : null}

      <button type="submit" className="sc-btn sc-btn--block" disabled={pending}>
        <CalendarCheckIcon size={17} stroke="#0c1316" strokeWidth={2} />
        {pending ? "Checking…" : "Check Availability"}
      </button>
    </form>
  );
}
