import { AdminView } from "@/components/admin/AdminView";
import { CodeGate } from "@/components/CodeGate";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHeader } from "@/components/ui";
import { getCurrentUser, isSuperUser } from "@/lib/auth";
import {
  getFamilyPriority,
  getGalleryPhotos,
  getLocalFavorites,
  getPlaces,
  getReservationsWithVotes,
  getUsers,
} from "@/lib/queries";

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Admin is in the nav for everyone; the code is what actually opens it.
  // Every action behind this page re-checks the same thing server-side.
  if (!isSuperUser(user)) {
    return (
      <div className="sc-page sc-page--tall">
        <div className="sc-content">
          <SiteHeader />
        </div>
        <CodeGate
          title="Admin access"
          lead={
            user
              ? `You’re identified as ${user.name}. Enter a super user’s reservation code to manage the house.`
              : "Enter your reservation code. Only super users can approve requests and edit house info."
          }
          path="/admin"
          requireSuper
        />
      </div>
    );
  }

  const [reservations, users, places, priority, photoSlots, favorites] =
    await Promise.all([
      getReservationsWithVotes(user!.id),
      getUsers(),
      getPlaces(),
      getFamilyPriority(),
      getGalleryPhotos(),
      getLocalFavorites(),
    ]);

  return (
    <div className="sc-page sc-page--tall">
      <div className="sc-mytrips-glow" aria-hidden />
      <div className="sc-content">
        <SiteHeader />
        <PageHeader
          kicker="MANAGE"
          title="Admin"
          lead="Approve requests and keep the house info up to date."
        />
        <AdminView
          reservations={reservations}
          users={users}
          places={places}
          priority={priority}
          photoSlots={photoSlots}
          favorites={favorites}
          firstPickFamily={priority.find((p) => p.rank === 1)?.family ?? null}
          viewerId={user!.id}
        />
      </div>
    </div>
  );
}
