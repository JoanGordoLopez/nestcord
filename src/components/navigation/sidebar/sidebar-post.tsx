"use client";

import { useUser } from "@/context/user-context";
import useSWR from "swr";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Feather,
  ImageIcon,
  SmileIcon,
  X,
  Earth,
  MapPin,
  AtSign,
} from "lucide-react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import Image from "next/image";
import { createPost } from "@/actions/create-post";
import { Separator } from "@/components/ui/separator";
import { DialogDescription } from "@radix-ui/react-dialog";
import imageCompression from "browser-image-compression";

const MAX_CHARACTERS = 250;

const formSchema = z.object({
  content: z
    .string()
    .min(1, "El post no puede estar vacío")
    .max(
      MAX_CHARACTERS,
      `El contenido debe tener menos de ${MAX_CHARACTERS} caracteres`,
    ),
});

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SidebarPost() {
  const { user } = useUser();

  const [displayEmojiTab, setDisplayEmojiTab] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate } = useSWR("/api/feed", fetcher);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });

  // Update character count whenever content changes
  useEffect(() => {
    const content = form.watch("content") || "";
    // Count characters properly, including emojis
    const count = [...content].length;
    setCharCount(count);
    setIsOverLimit(count > MAX_CHARACTERS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("content")]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        displayEmojiTab &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node) &&
        !document
          .querySelector(".EmojiPickerReact")
          ?.contains(event.target as Node)
      ) {
        setDisplayEmojiTab(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displayEmojiTab]);

  const handleEmojiInput = (emoji: EmojiClickData) => {
    const emojiText = String.fromCodePoint(Number.parseInt(emoji.unified, 16)); // Convertir el código Unicode en emoji

    /** Add emoji to content without removing */
    const content = form.getValues("content") as string;
    form.setValue("content", content + emojiText);
  };

  const handleSubmit = async (formData: FormData) => {
    if (isOverLimit) return;

    const data = new FormData();
    data.append("content", formData.get("content") as string);

    try {
      const success = await createPost(data, attachment, user);

      if (success) {
        form.resetField("content");
        form.resetField("content");
        setAttachment(null);
        setCharCount(0);
        setIsOverLimit(false);
        setDisplayEmojiTab(false);
        setIsDialogOpen(false);

        formRef.current?.reset();

        console.info(
          "\x1b[36m%s\x1b[0m",
          "[LOG]",
          "Created new status successfully",
        );

        // Refrescar los datos desde la API después de que el backend haya guardado el post
        mutate("/api/feed");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* Botón para desktop */}
      <DialogTrigger asChild>
        <button className="mt-4 w-full rounded-full bg-indigo-500 p-4 font-bold text-white hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
          <Feather className="h-6 w-6" />
          <span className="hidden xl:inline">Post</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="sr-only">Create a Post</DialogTitle>
          <div className="w-8"></div> {/* Spacer para centrar el título */}
        </DialogHeader>

        <Form {...form}>
          <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div className="flex items-start space-x-4">
              <Avatar className="w-10 h-10 border-2 border-transparent">
                <AvatarImage
                  src={user?.avatar || ""}
                  alt={`${user?.username}'s avatar`}
                />
                <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white">
                  {user?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What's happening now?"
                          className=" w-full resize-none min-h-[120px] text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {attachment && (
              <div className="relative mt-4 rounded-2xl overflow-hidden">
                <Image
                  src={URL.createObjectURL(attachment) || "/placeholder.svg"}
                  alt="Imagen adjunta"
                  className="max-w-full h-auto rounded-2xl object-cover"
                  width={500}
                  height={500}
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={() => setAttachment(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <DialogDescription className="text-sm text-gray-500">
              This post will be visible as{" "}
              <span className="font-bold">@{user?.username}</span>
            </DialogDescription>
            <Button className="bg-indigo-400 hover:bg-indigo-400 hover:cursor-not-allowed">
              <Earth className="h-4 w-4" />
              Build in Public
            </Button>
            <Separator className=" bg-gray-200 dark:bg-gray-800" />
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full text-indigo-500 hover:bg-sky-500/10 hover:text-indigo-600"
                  size="icon"
                  onClick={() => {
                    document.getElementById("file-upload")?.click();
                    setDisplayEmojiTab(false);
                  }}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];

                    const options = {
                      maxSizeMb: 30,
                      maxWidthOrHeight: 900,
                      useWebWorker: true,
                    };

                    if (file) {
                      const compressedFile = await imageCompression(
                        file,
                        options,
                      );
                      console.log(
                        "compressedFile instanceof Blob",
                        compressedFile instanceof Blob,
                      ); // true
                      console.log(
                        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`,
                      ); // smaller than maxSizeMB

                      const reader = new FileReader();
                      reader.onload = () => setAttachment(compressedFile);
                      reader.readAsDataURL(compressedFile);
                    }
                  }}
                />
                <Button
                  type="button"
                  ref={emojiButtonRef}
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${
                    displayEmojiTab
                      ? "text-indigo-500 bg-sky-500/10"
                      : "text-indigo-500 hover:bg-sky-500/10 hover:text-indigo-600"
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevenir envío del formulario
                    setDisplayEmojiTab((prev) => !prev);
                  }}
                >
                  <SmileIcon className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-indigo-500 hover:bg-sky-500/10 hover:text-indigo-600 hover:cursor-not-allowed"
                >
                  <MapPin className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-indigo-500 hover:bg-sky-500/10 hover:text-indigo-600 hover:cursor-not-allowed"
                >
                  <AtSign className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`text-sm ${
                    charCount > MAX_CHARACTERS * 0.8 &&
                    charCount <= MAX_CHARACTERS
                      ? "text-amber-500"
                      : isOverLimit
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {charCount}/{MAX_CHARACTERS}
                </div>
                <Separator
                  orientation="vertical"
                  className="h-6 bg-gray-200 dark:bg-gray-800"
                />
                <Button
                  type="submit"
                  className="rounded-full bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold px-5 py-2 transition-colors"
                  disabled={isOverLimit || charCount === 0}
                >
                  Post
                </Button>
              </div>
            </div>
          </form>
        </Form>

        {displayEmojiTab && (
          <div className="absolute z-50 left-0 sm:left-auto sm:right-0 mt-2">
            <EmojiPicker
              width={300}
              height={350}
              onEmojiClick={handleEmojiInput}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
