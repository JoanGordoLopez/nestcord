import { Suspense } from "react";
import { notFound } from "next/navigation";
import Sidebar from "@/components/navigation/sidebar/sidebar";
import { Loader2 } from "lucide-react";
import { ProfileAside } from "@/components/navigation/aside/aside";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ChatContainer } from "@/components/messages/chat-container";
import { fetchProfile } from "@/actions/fetch-profile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  try {
    const { username } = await params;
    const user = await fetchProfile(username);

    return {
      title: `${user.name} (@${user.username}) | Nestcord`,
      description: user.biography || `Profile of ${user.name} in Nestcord`,
      openGraph: {
        images: [{ url: user.avatar }],
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      title: "Profile not found | Nestcord",
      description: "This profile does not exist or is not available",
    };
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  let user;
  const { username } = await params;
  try {
    user = await fetchProfile(username);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <main className="flex-1 border-x border-gray-200 dark:border-gray-800 min-h-screen">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            }
          >
            <ProfileHeader
              id={user.id}
              username={user.username}
              name={user.name}
              avatar={user.avatar}
              banner={user.banner}
              biography={user.biography}
              location={user.location}
              website={user.website}
              following={user.following}
              followers={user.followers}
              created_at={user.created_at}
              isFollowing={false}
            />
            <ProfileTabs userId={user.id} />
          </Suspense>
        </main>

        <ProfileAside />
        <ChatContainer />
      </div>
    </div>
  );
}
