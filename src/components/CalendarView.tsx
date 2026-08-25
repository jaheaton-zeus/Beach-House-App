"use client";

import { useActionState, useMemo, useState } from "react";

import { requestBooking, type BookingResult } from "@/app/actions";
import {
  addMonths,
  formatLongDate,
  monthGrid,
  monthLabel,
  nights,
  parseLocalDate,
  toDateString,
  todayString,
} from "@/lib/format";
import { ArrowRight, ChevronLeft, ChevronRight } from "@/lib/icons";

import { InlineMessage } from "./ui";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export type BookedRange = { check_in: string; check_out: string };

/**
 * Expand reservations into the individual nights they occupy. A stay running
 * check-in → check-out occupies every night up to but not including the
 * check-out day, so the day one family leaves is bookable by the next.
 */
function bookedNights(ranges: BookedRange[]): Set<string> {
  const nightsTaken = new Set<string>();
  for (const range of ranges) {
    const cursor = parseLocalDate(range.check_in);
    const end = parseLocalDate(range.check_out);
    while (cursor < end) {
      nightsTaken.add(toDateString(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return nightsTaken;
}

export function CalendarView({ booked }: { booked: BookedRange[] }) {
  const today = todayString();
  const taken = useMemo(() => bookedNights(booked), [booked]);

  const now = parseLocalDate(today);
  const [offset, setOffset] = useState(0);
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [guests, setGuests] = useState(4);
  const [state, formAction, pending] = useActionState<BookingResult, FormData>(
    requestBooking,
    null
  );

  const months = [0, 1].map((i) => addMonths(now.getFullYear(), now.getMonth(), offset + i));

  /** True when any night in [from, to) is already spoken for. */
  const rangeIsClear = (from: string, to: string) => {
    const cursor = parseLocalDate(from);
    const stop = parseLocalDate(to);
    while (cursor < stop) {
      if (taken.has(toDateString(cursor))) return false;
      cursor.setDate(cursor.getDate() + 1);
    }
    return true;
  };

  const pick = (date: string) => {
    if (!start || (start && end)) {
      setStart(date);
      setEnd(null);
      return;
    }
    if (date <= start) {
      setStart(date);
      setEnd(null);
      return;
    }
    // A selection may not jump over someone else's stay.
    if (!rangeIsClear(start, date)) {
      setStart(date);
      setEnd(null);
      return;
    }
    setEnd(date);
  };

  const clear = () => {
    setStart(null);
    setEnd(null);
  };

  const nightCount = start && end ? nights(start, end) : 0;

  return (
    <>
      <div className="sc-legend">
        <div className="sc-legend__item">
          <span
            className="sc-legend__swatch"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
          Available
        </div>
        <div className="sc-legend__item">
          <span className="sc-legend__swatch" style={{ background: "rgba(111,167,147,0.9)" }} />
          Selected
        </div>
        <div className="sc-legend__item">
          <span
            className="sc-legend__swatch"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
          <span style={{ opacity: 0.5 }}>Booked</span>
        </div>
      </div>

      <div className="sc-months">
        {months.map(({ year, month }, index) => {
          const { days, startDow } = monthGrid(year, month);
          return (
            <div className="sc-month" key={`${year}-${month}`}>
              <div className="sc-month__head">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {index === 0 ? (
                    <button
                      type="button"
                      className="sc-iconbtn sc-iconbtn--sm"
                      aria-label="Previous month"
                      disabled={offset === 0}
                      onClick={() => setOffset((o) => Math.max(0, o - 1))}
                    >
                      <ChevronLeft size={13} />
                    </button>
                  ) : null}
                  <div className="sc-month__label">{monthLabel(month)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="sc-month__year">{year}</div>
                  {index === 1 ? (
                    <button
                      type="button"
                      className="sc-iconbtn sc-iconbtn--sm"
                      aria-label="Next month"
                      onClick={() => setOffset((o) => o + 1)}
                    >
                      <ChevronRight size={13} />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="sc-month__grid" style={{ marginBottom: 8 }}>
                {WEEKDAYS.map((wd, i) => (
                  <div className="sc-month__weekday" key={`${wd}-${i}`}>
                    {wd}
                  </div>
                ))}
              </div>

              <div className="sc-month__grid">
                {Array.from({ length: startDow }).map((_, i) => (
                  <div className="sc-day sc-day--empty" key={`pad-${i}`} />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isPast = date < today;
                  const isBooked = taken.has(date);
                  const isEnd = date === start || date === end;
                  const isMid = !!start && !!end && date > start && date < end;

                  const classes = ["sc-day"];
                  if (isPast) classes.push("sc-day--past");
                  else if (isBooked) classes.push("sc-day--booked");
                  if (isEnd) classes.push("sc-day--end");
                  else if (isMid) classes.push("sc-day--mid");

                  const disabled = isPast || (isBooked && !isEnd);

                  return (
                    <button
                      type="button"
                      key={date}
                      className={classes.join(" ")}
                      disabled={disabled}
                      aria-pressed={isEnd || isMid}
                      onClick={() => pick(date)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <form action={formAction} className="sc-summary">
        <input type="hidden" name="checkIn" value={start ?? ""} />
        <input type="hidden" name="checkOut" value={end ?? ""} />
        <input type="hidden" name="guests" value={guests} />

        <div className="sc-summary__row">
          <div className="sc-summary__group">
            <div>
              <div className="sc-summary__label">CHECK-IN</div>
              <div className="sc-summary__value">{start ? formatLongDate(start) : "—"}</div>
            </div>
            <ArrowRight size={20} stroke="rgba(255,255,255,0.4)" strokeWidth={1.7} />
            <div>
              <div className="sc-summary__label">CHECK-OUT</div>
              <div className="sc-summary__value">{end ? formatLongDate(end) : "—"}</div>
            </div>
            <div className="sc-summary__divider">
              <div className="sc-summary__label">NIGHTS</div>
              <div className="sc-summary__value" style={{ color: "var(--accent)" }}>
                {start && end ? nightCount : "—"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="sc-summary__label">GUESTS</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  className="sc-iconbtn sc-iconbtn--sm"
                  aria-label="Fewer guests"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                >
                  −
                </button>
                <span style={{ fontSize: 15, fontWeight: 700, minWidth: 16, textAlign: "center" }}>
                  {guests}
                </span>
                <button
                  type="button"
                  className="sc-iconbtn sc-iconbtn--sm"
                  aria-label="More guests"
                  onClick={() => setGuests((g) => Math.min(6, g + 1))}
                >
                  +
                </button>
              </div>
            </div>
            <div className="sc-summary__divider" style={{ paddingLeft: 20 }}>
              <label className="sc-summary__label" htmlFor="calendar-code">
                RESERVATION CODE
              </label>
              <input
                id="calendar-code"
                name="code"
                type="text"
                className="sc-input sc-input--code"
                placeholder="e.g. PIERCE7"
                style={{ width: 150, padding: "9px 12px", fontSize: 13.5, borderRadius: 11 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
            <button
              type="button"
              className="sc-btn sc-btn--ghost"
              style={{ padding: "13px 20px", fontSize: 14 }}
              onClick={clear}
            >
              Clear
            </button>
            <button
              type="submit"
              className="sc-btn"
              style={{ padding: "14px 26px", fontSize: 14.5 }}
              disabled={pending}
            >
              {pending ? "Sending…" : "Request These Dates"}
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(12,19,22,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowRight size={13} stroke="#0c1316" />
              </span>
            </button>
          </div>
        </div>

        {state ? (
          <InlineMessage kind={state.ok ? "ok" : "err"} style={{ marginTop: 16 }}>
            {state.message}
          </InlineMessage>
        ) : null}
      </form>
    </>
  );
}
