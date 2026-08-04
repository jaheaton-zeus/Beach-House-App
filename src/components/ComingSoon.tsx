import { THEMES } from "@/lib/theme";
import { Card, Screen, FONT_DISPLAY } from "@/components/ui";

export function ComingSoon({ title, note }: { title: string; note?: string }) {
  const theme = THEMES.shore;
  return (
    <Screen>
      <div style={{ padding: "40px 20px" }}>
        <Card theme={theme} style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: theme.text, marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 14, color: theme.textMuted }}>
            {note ?? "This screen is being built next — check back soon."}
          </div>
        </Card>
      </div>
    </Screen>
  );
}
