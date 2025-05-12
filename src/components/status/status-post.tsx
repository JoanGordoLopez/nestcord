"use client"
import { useUser } from "@/context/user-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Smile, X, MapPin, AtSign, EarthIcon } from "lucide-react"
import { createPost } from "@/actions/create-post"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import Image from "next/image"
import imageCompression from "browser-image-compression"

const MAX_CHARS = 250

const FormSchema = z.object({
    post: z
        .string()
        .min(1, {
            message: "The post content cannot be empty.",
        })
        .max(MAX_CHARS, {
            message: `The post content cannot be longer than ${MAX_CHARS} characters.`,
        }),
})

export default function StatusPost() {
    const { user } = useUser()
    const [charCount, setCharCount] = useState(0)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [displayEmojiTab, setDisplayEmojiTab] = useState(false)
    const [attachment, setAttachment] = useState<File | null>(null)
    const emojiButtonRef = useRef<HTMLButtonElement>(null)

    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            post: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const formData = new FormData()
        formData.append("content", data.post)

        setLoading(true)
        try {
            const success = await createPost(formData, attachment, user)
            if (success) {
                form.reset()
                setAttachment(null)
                setDisplayEmojiTab(false)
                setCharCount(0)
            }
        } catch (error) {
            console.error("Error creating post:", error)
        } finally {
            setLoading(false)
        }
    }

    // Handle emoji selection
    const handleEmojiInput = (emoji: EmojiClickData) => {
        const emojiText = String.fromCodePoint(
            Number.parseInt(emoji.unified, 16)
        )

        const content = form.getValues("post") as string
        form.setValue("post", content + emojiText)
    }

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
                setDisplayEmojiTab(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [displayEmojiTab])

    return (
        <Card className="w-full max-w-2xl border-0 shadow-none">
            <CardHeader className="sr-only">Create a new post</CardHeader>
            <CardContent className="px-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={user?.avatar}
                                    alt={user?.name}
                                />
                                <AvatarFallback className="bg-muted">
                                    {user?.name?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="post"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="What's happening now?"
                                                    className="border-1 bg-transparent px-3 text-lg focus-visible:ring-0 resize-none overflow-hidden"
                                                    {...field}
                                                    ref={textareaRef}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        setCharCount(
                                                            e.target.value
                                                                .length
                                                        )
                                                    }}
                                                    maxLength={MAX_CHARS}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-center gap-1 text-indigo-400 text-sm">
                                    <EarthIcon className="w-4 h-4" />
                                    <span>
                                        Visible to everyone as{" "}
                                        <span className="font-bold">
                                            @{user?.username}
                                        </span>
                                    </span>
                                </div>

                                <Separator className="bg-gray-200 dark:bg-gray-800 md:orientation-vertical md:h-auto md:w-px" />

                                {attachment && (
                                    <div className="relative mt-4 rounded-2xl overflow-hidden">
                                        <Image
                                            src={
                                                URL.createObjectURL(
                                                    attachment
                                                ) || "/placeholder.svg"
                                            }
                                            alt="Attached image"
                                            className="max-w-full h-auto rounded-2xl object-cover"
                                            width={500}
                                            height={300}
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

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 text-indigo-500">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="rounded-full text-indigo-500 hover:bg-sky-500/10 hover:text-indigo-600"
                                            size="icon"
                                            onClick={() => {
                                                document
                                                    .getElementById(
                                                        "file-upload"
                                                    )
                                                    ?.click()
                                                setDisplayEmojiTab(false)
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
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    const options = {
                                                        maxSizeMb: 30,
                                                        maxWidthOrHeight: 900,
                                                        useWebWorker: true,
                                                    }

                                                    try {
                                                        const compressedFile =
                                                            await imageCompression(
                                                                file,
                                                                options
                                                            )
                                                        setAttachment(
                                                            compressedFile
                                                        )
                                                    } catch (error) {
                                                        console.error(
                                                            "Error compressing image:",
                                                            error
                                                        )
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            ref={emojiButtonRef}
                                            variant="ghost"
                                            className={
                                                "rounded-full p-2 text-indigo-500 hover:bg-sky-500/10 hover:text-indigo-600"
                                            }
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setDisplayEmojiTab(
                                                    (prev) => !prev
                                                )
                                            }}
                                        >
                                            <Smile className="h-5 w-5" />
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

                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`text-sm ${charCount > MAX_CHARS ? "text-red-500" : "text-muted-foreground"}`}
                                        >
                                            {charCount}/{MAX_CHARS}
                                        </span>
                                        {loading ? (
                                            <Button
                                                type="submit"
                                                className="rounded-full px-4 bg-gray-500 text-white"
                                                variant="secondary"
                                                disabled={
                                                    charCount === 0 ||
                                                    charCount > MAX_CHARS
                                                }
                                            >
                                                Posting...
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                className="rounded-full px-4 bg-indigo-500 hover:bg-indigo-600 text-white"
                                                variant="secondary"
                                                disabled={
                                                    charCount === 0 ||
                                                    charCount > MAX_CHARS
                                                }
                                            >
                                                Post
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {displayEmojiTab && (
                                    <div className="absolute z-50 mt-2">
                                        <EmojiPicker
                                            width={300}
                                            height={350}
                                            onEmojiClick={handleEmojiInput}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
