"use client";

import { useState } from "react";

import { removeUser, saveUser } from "@/app/admin-actions";
import type { UserRow } from "@/lib/db";
import { Avatar } from "@/components/ui";

type FormState = { user: UserRow | null } | null;

export function UsersAdmin({ users, viewerId }: { users: UserRow[]; viewerId: number }) {
  const [form, setForm] = useState<FormState>(null);
  const editing = form?.user ?? null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>Users</div>
        <button
          type="button"
          className="sc-btn sc-btn--sm"
          style={{ padding: "10px 18px", fontSize: 13.5 }}
          onClick={() => setForm({ user: null })}
        >
          + Add user
        </button>
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 18px" }}>
        Each user books with their reservation code. Super Users can approve or deny requests.
      </p>

      {form ? (
        <form
          action={saveUser}
          className="sc-admin-form"
          key={editing?.id ?? "new"}
          onSubmit={() => setForm(null)}
        >
          <input type="hidden" name="id" value={editing?.id ?? 0} />
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>
            {editing ? "Edit user" : "Add user"}
          </div>
          <div className="sc-admin-form__grid">
            <div>
              <div className="sc-field-label">Name</div>
              <input
                name="name"
                type="text"
                className="sc-input"
                placeholder="Full name"
                defaultValue={editing?.name ?? ""}
                required
              />
            </div>
            <div>
              <div className="sc-field-label">Email</div>
              <input
                name="email"
                type="email"
                className="sc-input"
                placeholder="name@email.com"
                defaultValue={editing?.email ?? ""}
                required
              />
            </div>
            <div>
              <div className="sc-field-label">Reservation code</div>
              <input
                name="code"
                type="text"
                className="sc-input sc-input--code"
                placeholder="e.g. PIERCE7"
                defaultValue={editing?.code ?? ""}
                required
              />
            </div>
            <div>
              <div className="sc-field-label">Family</div>
              <select name="family" className="sc-input" defaultValue={editing?.family ?? "Pierce"}>
                <option value="Pierce">Pierce</option>
                <option value="Thomas">Thomas</option>
              </select>
            </div>
          </div>

          <label className="sc-super-toggle">
            <input
              type="checkbox"
              name="superUser"
              defaultChecked={editing?.super_user === 1}
            />
            Super User — can approve requests
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button type="submit" className="sc-btn sc-btn--sm" style={{ padding: "11px 22px" }}>
              Save
            </button>
            <button
              type="button"
              className="sc-btn sc-btn--ghost sc-btn--sm"
              style={{ padding: "11px 20px" }}
              onClick={() => setForm(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div style={{ display: "grid", gap: 10 }}>
        {users.map((user) => (
          <div key={user.id} className="sc-admin-row sc-user-row">
            <Avatar name={user.name} family={user.family} />
            <div className="sc-user-row__info">
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 15.5, fontWeight: 700 }}>{user.name}</span>
                {user.super_user === 1 ? <span className="sc-superbadge">Super User</span> : null}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                {user.email} · {user.family}
              </div>
            </div>
            <div className="sc-user-row__actions">
              <span className="sc-codechip">{user.code}</span>
              <button
                type="button"
                className="sc-btn sc-btn--ghost sc-btn--sm"
                style={{ padding: "8px 14px", fontSize: 12.5 }}
                onClick={() => setForm({ user })}
              >
                Edit
              </button>
              {user.id === viewerId ? (
                <span
                  className="sc-removebtn"
                  title="You can’t remove yourself"
                  aria-hidden
                  style={{ opacity: 0.3, cursor: "default" }}
                >
                  ×
                </span>
              ) : (
                <form action={removeUser}>
                  <input type="hidden" name="id" value={user.id} />
                  <button
                    type="submit"
                    className="sc-removebtn"
                    title={`Remove ${user.name}`}
                    aria-label={`Remove ${user.name}`}
                  >
                    ×
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
