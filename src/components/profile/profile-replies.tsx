"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import type { CardProps } from "@/components/status/status-card";
import ReplyCard from "@/components/status/status-reply-card";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ProfileReplies({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/user/replies?id=${id}`,
    fetcher,
  );
  const [replies, setReplies] = useState<CardProps[]>([]);

  useEffect(() => {
    if (data) {
      setReplies(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-red-500">Error to load replies</p>
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">No replies yet</h2>
        <p className="text-gray-500 mb-6">
          When this user replies to posts, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {replies.map((reply) => (
        <ReplyCard key={reply.id} {...reply} />
      ))}
    </div>
  );
}
