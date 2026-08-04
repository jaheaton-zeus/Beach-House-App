import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ComingSoon } from "@/components/ComingSoon";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ComingSoon title="House Info" />;
}
