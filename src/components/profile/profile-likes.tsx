"use client";
import { useState, useEffect } from "react";
import Card from "@/components/status/status-card";
import { Loader2 } from "lucide-react";
import { fetchProfileLikes } from "@/actions/profile/fetch-likes";

type LikesProps = {
  id: string;
  status: {
    id: string;
    author: {
      id: string;
      name: string;
      username: string;
      avatar: string;
      biography: string;
      created_at: string;
    };
    content: string;
    attachment: string;
    comments: number;
    likes: number;
    views: number;
    created_at: string;
    updated_at: string;
  };
};
export default function ProfileLikes({ id }: { id: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [likes, setLikes] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchProfileLikes(id); // Llamada a la función para obtener los likes
        if (data) {
          setLikes(data);
        } else {
          setError("Couldn't load likes");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("There was an error while loading likes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Dependencia de id, se ejecuta cuando cambia el id

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
      </div>
    );
  }

  if (likes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">No likes yet</h2>
        <p className="text-gray-500 mb-6">
          When this user likes a post, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {likes.map((like: LikesProps) => (
        <Card
          key={like.id}
          id={like.status.id}
          likes={like.status.likes}
          author={like.status.author}
          content={like.status.content}
          created_at={like.status.created_at}
          views={like.status.views}
          attachment={like.status.attachment}
          comments={like.status.comments}
        />
      ))}
    </div>
  );
}
