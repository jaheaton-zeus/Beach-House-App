"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { LocalRecRow } from "@/app/(app)/info/page";
import { addLocalRec, removeLocalRec } from "@/app/admin-actions";
import { Icons } from "@/lib/icons";
import { Btn, Card, IconBtn, Input, Screen, Textarea } from "@/components/ui";

const CATS = ["Dining", "Beach", "Bike & Trails", "Activities", "Groceries"];
const blank = { category: CATS[0], name: "", note: "", tag: "", walk: "" };

export function AroundAdmin({ theme, items }: { theme: ThemeColors; items: LocalRecRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [draft, setDraft] = useState(blank);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1400);
  };

  const addItem = () => {
    if (!draft.name.trim()) return;
    startTransition(async () => {
      const result = await addLocalRec(draft);
      if (result.error) {
        flash(result.error);
        return;
      }
      setDraft(blank);
      setShowForm(false);
      flash("Added");
      router.refresh();
    });
  };

  const removeItem = (id: number) => {
    startTransition(async () => {
      await removeLocalRec(id);
      flash("Removed");
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
          {showForm ? "Cancel" : "+ Add a place"}
        </Btn>

        {showForm && (
          <Card theme={theme} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setDraft((d) => ({ ...d, category: c }))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 99,
                    background: draft.category === c ? theme.text : theme.surfaceAlt,
                    color: draft.category === c ? "#fff" : theme.text,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <Input label="Name" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="e.g. Salty Dog Café" theme={theme} />
            <Textarea label="Note" value={draft.note} onChange={(v) => setDraft((d) => ({ ...d, note: v }))} placeholder="Why the family likes it" rows={2} theme={theme} />
            <div style={{ display: "flex", gap: 10 }}>
              <Input label="Tag" value={draft.tag} onChange={(v) => setDraft((d) => ({ ...d, tag: v }))} placeholder="e.g. Seafood" theme={theme} style={{ flex: 1 }} />
              <Input label="Distance" value={draft.walk} onChange={(v) => setDraft((d) => ({ ...d, walk: v }))} placeholder="e.g. 10 min drive" theme={theme} style={{ flex: 1 }} />
            </div>
            <Btn onClick={addItem} theme={theme} variant="primary" full disabled={isPending}>
              Save place
            </Btn>
          </Card>
        )}

        {CATS.map((c) => {
          const catItems = items.filter((it) => it.category === c);
          if (catItems.length === 0) return null;
          return (
            <div key={c}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "8px 4px 6px" }}>
                {c} <span style={{ color: theme.textSubtle, fontWeight: 400 }}>· {catItems.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {catItems.map((item) => (
                  <Card key={item.id} theme={theme} style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 2 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.4 }}>{item.note}</div>
                        {item.walk && <div style={{ fontSize: 11, color: theme.textSubtle, marginTop: 4 }}>{item.walk}</div>}
                      </div>
                      <IconBtn theme={theme} onClick={() => removeItem(item.id)}>
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
