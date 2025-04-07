"use client";
import { createClient } from "@/database/client";
import { useUser } from "@/context/user-context";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, CheckCheck, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User } from "@/components/messages/chat-container";

import { formatDistanceToNow } from "date-fns";

import { useChat } from "@/hooks/use-chat";
import { Textarea } from "../ui/textarea";

interface ChatConversationProps {
  user: User;
  onBack: () => void;
  channelId: string;
}

export function ChatConversation({
  user,
  onBack,
  channelId,
}: ChatConversationProps) {
  const author = useUser();
  const { messages } = useChat(channelId);
  const [message, setMessage] = useState("");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  const sendMessage = async () => {
    const db = await createClient();
    if (!message.trim()) return;

    await db.from("messages").insert({
      content: message,
      author: author.user?.id,
      delivered_to: user.id,
      channel_id: channelId,
    });

    setMessage("");
  };

  // Format the timestamp to a more readable format
  function formatTimeDistance(dateString: string): string {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b p-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea
        className="flex h-[270px] w-[auto] rounded-md border p-4"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isAuthor = message.author === author.user?.id;

            return (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${isAuthor ? "justify-end" : "justify-start"}`}
                ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                {!isAuthor && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    isAuthor ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="break-words break-all whitespace-pre-wrap">
                    {message.content}
                  </p>

                  <div
                    className={`flex items-center justify-end mt-1 text-xs gap-1 ${
                      isAuthor
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span>{formatTimeDistance(message.created_at)}</span>
                    {isAuthor && (
                      <span className="ml-1 flex items-center">
                        {message.read_state === true ? (
                          <CheckCheck
                            className="h-3 w-3 text-blue-500"
                            aria-label="Read"
                          />
                        ) : (
                          <Check className="h-3 w-3" aria-label="Sent" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {isAuthor && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={author.user?.avatar} alt="You" />
                    <AvatarFallback>
                      {author.user?.name?.charAt(0) || "Y"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="border-t p-3 sticky bottom-0 bg-white">
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 resize-none rounded-lg p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={message.trim() === ""}
            className="px-4 flex items-center justify-center rounded-lg"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
