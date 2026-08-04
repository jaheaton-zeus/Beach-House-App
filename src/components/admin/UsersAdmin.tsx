"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { UserRow } from "@/lib/db";
import { addUser, toggleUserRole, removeUser } from "@/app/admin-actions";
import { Icons } from "@/lib/icons";
import { Avatar, Btn, Card, IconBtn, Input, Screen } from "@/components/ui";

export function UsersAdmin({ theme, currentUser, users }: { theme: ThemeColors; currentUser: UserRow; users: UserRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const families = [...new Set(users.map((u) => u.family))];
  const blank = { name: "", email: "", role: "member" as "member" | "admin", family: (families[0] || "Pierce") as "Pierce" | "Thomas" };
  const [draft, setDraft] = useState(blank);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1400);
  };

  const submit = () => {
    if (!draft.name.trim() || !draft.email.trim()) return;
    startTransition(async () => {
      const result = await addUser(draft);
      if (result.error) {
        flash(result.error);
        return;
      }
      setDraft(blank);
      setShowForm(false);
      flash("User added");
      router.refresh();
    });
  };

  const toggleRole = (id: number) => {
    startTransition(async () => {
      await toggleUserRole(id);
      flash("Role updated");
      router.refresh();
    });
  };

  const remove = (id: number) => {
    startTransition(async () => {
      const result = await removeUser(id);
      flash(result.error ?? "User removed");
      router.refresh();
    });
  };

  return (
    <Screen>
      <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {toast && (
          <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99, fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
            {toast}
          </div>
        )}

        <Btn onClick={() => setShowForm((s) => !s)} theme={theme} variant={showForm ? "secondary" : "primary"} full>
          {showForm ? "Cancel" : "+ Add a user"}
        </Btn>

        {showForm && (
          <Card theme={theme} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <Input label="Name" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="Full name" theme={theme} />
            <Input label="Email" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} placeholder="name@family.com" theme={theme} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {families.map((f) => (
                <button
                  key={f}
                  onClick={() => setDraft((d) => ({ ...d, family: f }))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 99,
                    background: draft.family === f ? theme.text : theme.surfaceAlt,
                    color: draft.family === f ? "#fff" : theme.text,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["member", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDraft((d) => ({ ...d, role: r }))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 99,
                    background: draft.role === r ? theme.accent : theme.surfaceAlt,
                    color: draft.role === r ? "#fff" : theme.text,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    textTransform: "capitalize",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: theme.textSubtle }}>
              New users get a temporary password (<code>welcome123</code>) — this goes away once Cloudflare Access replaces login entirely.
            </div>
            <Btn onClick={submit} theme={theme} variant="primary" full disabled={isPending}>
              Save user
            </Btn>
          </Card>
        )}

        {families.map((fam) => {
          const famUsers = users.filter((u) => u.family === fam);
          return (
            <div key={fam}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "8px 4px 6px" }}>
                {fam} <span style={{ color: theme.textSubtle, fontWeight: 400 }}>· {famUsers.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {famUsers.map((u) => (
                  <Card key={u.id} theme={theme} style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar initials={u.avatar} size={36} family={u.family} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
                          {u.name}
                          {u.id === currentUser.id && <span style={{ color: theme.textSubtle, fontWeight: 400 }}> (you)</span>}
                        </div>
                        <div style={{ fontSize: 12, color: theme.textMuted }}>{u.email}</div>
                      </div>
                      <button
                        onClick={() => toggleRole(u.id)}
                        disabled={isPending}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 99,
                          background: u.role === "admin" ? theme.accentSoft : theme.surfaceAlt,
                          color: u.role === "admin" ? theme.accentDeep : theme.textMuted,
                          border: "none",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                          textTransform: "capitalize",
                        }}
                      >
                        {u.role}
                      </button>
                      <IconBtn theme={theme} onClick={() => remove(u.id)}>
                        {Icons.close(theme.textMuted)}
                      </IconBtn>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
