import { getCurrentUser } from "@/lib/auth";

import { SiteHeaderClient } from "./SiteHeaderClient";

/**
 * Server wrapper so every page's header knows who is signed in without each
 * page having to look the user up and pass them down.
 */
export async function SiteHeader() {
  const user = await getCurrentUser();
  return <SiteHeaderClient userName={user?.name ?? null} />;
}
