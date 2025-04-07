"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfilePosts } from "@/components/profile/profile-posts";
import { ProfileReplies } from "@/components/profile/profile-replies";
import ProfileLikes from "@/components/profile/profile-likes";
interface ProfileTabsProps {
  userId: string;
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <Tabs
      defaultValue="posts"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="top-14 z-10 flex w-full justify-between bg-white/80 dark:bg-black/80  backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <TabsTrigger
          value="posts"
          className="flex-1 rounded-none border-0 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="replies"
          className="flex-1 rounded-none border-0 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Replies
        </TabsTrigger>

        <TabsTrigger
          value="likes"
          className="flex-1 rounded-none border-0 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Likes
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="posts"
        className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <ProfilePosts id={userId} />
      </TabsContent>

      <TabsContent
        value="replies"
        className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <ProfileReplies id={userId} />
      </TabsContent>

      <TabsContent
        value="likes"
        className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <ProfileLikes id={userId} />
      </TabsContent>
    </Tabs>
  );
}
