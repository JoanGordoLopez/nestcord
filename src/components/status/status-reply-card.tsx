"use client";
import { useUser } from "@/context/user-context";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share,
  Send,
  BarChartIcon as ChartNoAxesColumn,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import StatusOptions from "@/components/status/status-options";

import { ChatConversation } from "@/components/messages/chat-conversation";

export interface CardProps {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    biography?: string;
    created_at: string;
  };
  attachment?: string;
  content: string;
  comments: number;
  likes: number;
  views: number;
  created_at: string;
}

export default function ReplyCard({
  id,
  author,
  content,
  likes,
  views,
  attachment,
  created_at,
}: CardProps) {
  const { user } = useUser();

  const [hasLiked, setHasLiked] = useState(false);
  const [statusLikes, setStatusLikes] = useState(likes);
  const [isOpen, setIsOpen] = useState(false);

  // Función para simular el like
  const handleLike = () => {
    if (hasLiked) {
      setStatusLikes((prev) => Math.max(prev - 1, 0));
    } else {
      setStatusLikes((prev) => prev + 1);
    }
    setHasLiked(!hasLiked);
  };

  // Función para abrir/cerrar chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const isThisYear = date.getFullYear() === now.getFullYear();

    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      ...(isThisYear ? {} : { year: "numeric" }),
    }).format(date);
  };

  {
    /** Handle share link to clipboard */
  }
  const shareLink = () => {
    navigator.clipboard.writeText(
      "https://nestcord.vercel.app/" + author.username + "/status/" + id,
    );
    console.info(
      "\x1b[36m%s\x1b[0m",
      "[LOG]",
      `Copied status ${id} to clipboard`,
    );
  };

  const uuid1 = user?.id;
  const uuid2 = author.id;

  let channelId: string | undefined;

  if (uuid1 && uuid2) {
    // Extraer la primera parte de cada UUID
    const firstPart1 = uuid1.split("-")[0];
    const firstPart2 = uuid2.split("-")[0];

    // Convertir de hexadecimal a decimal y sumar
    const decimal1 = parseInt(firstPart1, 16);
    const decimal2 = parseInt(firstPart2, 16);

    channelId = (decimal1 + decimal2).toString();

    return (
      <div className="bg-white dark:bg-black px-4 py-3 hover:bg-gray-800/30 cursor-pointer transition-colors">
        <div className="flex gap-3">
          {/* Avatar del autor */}
          <Link href={`/${author.username}`} className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar} alt={author.username} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            {/* Información del autor y opciones */}
            <div className="flex items-center w-full">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    href={`/${author.username}`}
                    className="font-bold hover:underline"
                  >
                    {author.name}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 bg-black border border-gray-800 text-white p-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={author.avatar} alt={author.username} />
                      <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/${author.username}`}
                      className="font-bold hover:underline"
                    >
                      {author.name}
                    </Link>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">
                      {author.biography || "No bio available"}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <span className="text-gray-500 text-sm ml-2">
                @{author.username} · {formatDate(created_at)}
              </span>

              <div className="ml-auto">
                <StatusOptions
                  author={author.id}
                  username={author.username}
                  id={id}
                />
              </div>
            </div>

            {/* Contenido del post */}
            <div className="text-[15px] leading-normal break-words whitespace-pre-wrap">
              {content}
            </div>

            {attachment && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <Image
                  src={attachment || "/placeholder.svg"}
                  alt="Attachment"
                  className="max-w-full h-auto"
                  width={500}
                  height={300}
                />
              </div>
            )}

            {/* Acciones del post */}
            <div className="flex justify-between items-center mt-3">
              {/* Izquierda: Comentarios, Likes, Vistas */}
              <div className="flex items-center gap-4">
                {/* Likes */}
                <Button
                  variant="ghost"
                  onClick={handleLike}
                  className={`group flex items-center gap-1 p-0 ${hasLiked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"}`}
                >
                  <div
                    className={`rounded-full p-1.5 ${hasLiked ? "bg-pink-500/10" : "group-hover:bg-pink-500/10"}`}
                  >
                    <Heart
                      className={`h-4 w-4 ${hasLiked ? "fill-pink-500" : ""}`}
                    />
                  </div>
                  <span className="text-xs">{statusLikes}</span>
                </Button>

                {/* Vistas */}
                <Button
                  variant="ghost"
                  className="group flex items-center gap-1 text-gray-500 hover:text-sky-500 p-0"
                >
                  <div className="rounded-full p-1.5 group-hover:bg-sky-500/10">
                    <ChartNoAxesColumn className="h-4 w-4" />
                  </div>
                  <span className="text-xs">{views}</span>
                </Button>
              </div>

              {/* Derecha: Compartir y Mensajería */}
              <div className="flex items-center gap-2">
                {/* Compartir */}
                <Button
                  variant="ghost"
                  onClick={shareLink}
                  className="rounded-full p-1.5 text-gray-500 hover:bg-sky-500/10 hover:text-sky-500"
                >
                  <Share className="h-4 w-4" />
                </Button>

                {/* Mensajería */}
                {/* Mensajería */}
                {author.id !== user?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-blue-500 hover:cursor-pointer"
                    onClick={toggleChat}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            {/* Chat (simulado) */}
            {isOpen && channelId && (
              <ChatConversation
                user={author}
                onBack={toggleChat}
                channelId={channelId}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
