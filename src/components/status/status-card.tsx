"use client"
import { createClient } from "@/database/client"
import type React from "react"
import { useUser } from "@/context/user-context"
import { ChatConversation } from "@/components/messages/chat-conversation"
import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Heart,
    MessageCircle,
    Share,
    Send,
    BarChartIcon as ChartNoAxesColumn,
    X,
    ZoomIn,
    Download,
} from "lucide-react"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useInView } from "react-intersection-observer"
import { updateStatusViews } from "@/actions/update-views"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { mutate } from "swr"

export interface CardProps {
    id: string
    author: {
        id: string
        name: string
        username: string
        avatar: string
        biography?: string
        created_at: string
    }
    attachment?: string
    content: string
    comments: number
    likes: number
    views: number
    created_at: string
}

const StatusCardOptions = dynamic(
    () => import("@/components/status/status-options"),
    { ssr: false }
)

export default function StatusCard({
    id,
    author,
    content,
    comments,
    likes,
    views,
    attachment,
    created_at,
}: CardProps) {
    const { user } = useUser()
    const db = createClient()
    const [hasLiked, setHasLiked] = useState(false)
    const [statusLikes, setStatusLikes] = useState(likes)
    const [isOpen, setIsOpen] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [imageError, setImageError] = useState(false)

    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    const hasViewed = useRef(false)
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    })

    const handleLike = async () => {
        if (!user) return

        // Verificar si el usuario ya ha dado like
        const { data, error } = await db
            .from("likes")
            .select("id")
            .eq("status", id)
            .eq("user_id", user.id)
            .single()

        if (error && error.code !== "PGRST116") {
            console.error("Error al verificar like:", error)
            return
        }

        if (data) {
            // Si ya existe el like, lo eliminamos
            await db
                .from("likes")
                .delete()
                .match({ status: id, user_id: user.id })

            // Reducir el contador de likes en la tabla status
            await db
                .from("status")
                .update({ likes: statusLikes - 1 })
                .eq("id", id)

            await db
                .from("status_replies")
                .update({ likes: statusLikes - 1 })
                .eq("id", id)

            // Reducir el contador localmente
            setStatusLikes((prev) => Math.max(prev - 1, 0))
            setHasLiked(false) // Actualizamos el estado del like
        } else {
            // Si no existe, agregamos el like
            await db
                .from("likes")
                .insert({ status: id, user_id: user.id, author: author.id })

            // Aumentar el contador de likes en la tabla status
            await db
                .from("status")
                .update({ likes: statusLikes + 1 })
                .eq("id", id)

            await db
                .from("status_replies")
                .update({ likes: statusLikes + 1 })
                .eq("id", id)

            // Aumentar el contador localmente
            setStatusLikes((prev) => prev + 1)
            setHasLiked(true) // Actualizamos el estado del like
        }
    }

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!user) return

            const { data } = await db
                .from("likes")
                .select("id")
                .eq("status", id)
                .eq("user_id", user.id)

            if (!data) return

            if (data?.length > 0) {
                setHasLiked(!!data) // Si data existe, significa que el usuario ya dio like
            }
        }

        fetchLikeStatus()
    }, [db, id, user])

    // Simulación de aumento de vistas
    useEffect(() => {
        if (inView && !hasViewed.current) {
            updateStatusViews(id, views + 1).then((success) => {
                if (success) mutate(`/api/feed?id=${id}`)
            })
            hasViewed.current = true
        }
    }, [author.id, id, inView, views])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()

        const isThisYear = date.getFullYear() === now.getFullYear()

        return new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "short",
            ...(isThisYear ? {} : { year: "numeric" }),
        }).format(date)
    }

    // Handle share link to clipboard
    const shareLink = () => {
        navigator.clipboard.writeText(
            "https://nestcord.vercel.app/" + author.username + "/status/" + id
        )
        console.info(
            "\x1b[36m%s\x1b[0m",
            "[LOG]",
            `Copied status ${id} to clipboard`
        )
    }

    // Función para descargar la imagen
    const downloadImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!attachment) return

        // Abrir en una nueva pestaña
        const link = document.createElement("a") // Crear un enlace
        link.href = attachment // Asignar la URL del enlace
        link.download = `image-${id}.jpg` // Asignar el nombre de descarga
        link.target = "_blank" // Establecer el atributo target en _blank para abrir en una nueva pestaña
        link.rel = "noopener noreferrer" // Establecer las relaciones de enlace
        link.style.display = "none" // Ocultar el enlace para evitar que se muestre en la vista previa
        document.body.appendChild(link) // Añadir el enlace al documento
        link.click() // Abrir el enlace para descargar la imagen
        document.body.removeChild(link) // Eliminar el enlace del documento
    }

    const uuid1 = user?.id
    const uuid2 = author.id

    let channelId: string | undefined

    if (uuid1 && uuid2) {
        // Extraer la primera parte de cada UUID
        const firstPart1 = uuid1.split("-")[0]
        const firstPart2 = uuid2.split("-")[0]

        // Convertir de hexadecimal a decimal y sumar
        const decimal1 = Number.parseInt(firstPart1, 16)
        const decimal2 = Number.parseInt(firstPart2, 16)

        channelId = (decimal1 + decimal2).toString()
    }

    return (
        <div
            className="bg-white dark:bg-background px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
            ref={ref}
        >
            <div className="flex gap-3">
                {/* Avatar del autor */}
                <Link href={`/${author.username}`} className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={author.avatar}
                            alt={author.username}
                        />
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
                            <HoverCardContent className="w-64 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-black dark:text-white p-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={author.avatar}
                                            alt={author.username}
                                        />
                                        <AvatarFallback>
                                            {author.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Link
                                        href={`/${author.username}`}
                                        className="font-bold hover:underline"
                                    >
                                        {author.name}
                                    </Link>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {author.biography || "No bio available"}
                                    </p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>

                        <span className="text-gray-500 text-sm ml-2">
                            @{author.username} · {formatDate(created_at)}
                        </span>

                        <div className="ml-auto">
                            <StatusCardOptions
                                author={author.id}
                                username={author.username}
                                id={id}
                            />
                        </div>
                    </div>

                    {/* Contenido del post */}
                    <Link
                        href={`${author.username}/status/${id}`}
                        className="mt-2 block"
                    >
                        <div className="text-[15px] leading-normal break-all whitespace-pre-wrap">
                            {content}
                        </div>
                    </Link>

                    {/* Imagen adjunta */}
                    {attachment && (
                        <div
                            className="mt-3 rounded-xl overflow-hidden relative cursor-zoom-in"
                            onClick={() => setImageDialogOpen(true)}
                        >
                            {imageLoading && !imageError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            )}

                            {!imageError ? (
                                <div className="relative group">
                                    <Image
                                        src={attachment}
                                        alt="Attachment"
                                        className={`max-w-full h-auto transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                                        width={1200}
                                        height={900}
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => {
                                            setImageLoading(false)
                                            setImageError(true)
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        <ZoomIn className="h-8 w-8 text-white drop-shadow-md" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-40 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                    <p className="text-gray-500">
                                        Error al cargar la imagen
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Acciones del post */}
                    <div className="flex justify-between items-center mt-3">
                        {/* Izquierda: Comentarios, Likes, Vistas */}
                        <div className="flex items-center gap-4">
                            {/* Comentarios */}
                            <Link href={`${author.username}/status/${id}`}>
                                <Button
                                    variant="ghost"
                                    className="group flex items-center gap-1 text-gray-500 hover:text-indigo-500 p-0 hover:bg-transparent"
                                >
                                    <div className="rounded-full p-1.5 group-hover:bg-sky-500/10">
                                        <MessageCircle className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs">{comments}</span>
                                </Button>
                            </Link>

                            {/* Likes */}
                            <Button
                                variant="ghost"
                                onClick={handleLike}
                                className={`group flex items-center gap-1 p-0 ${hasLiked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"} hover:bg-transparent`}
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
                            <Link href={`${author.username}/status/${id}`}>
                                <Button
                                    variant="ghost"
                                    className="group flex items-center gap-1 text-gray-500 hover:text-indigo-500 p-0 hover:bg-transparent"
                                >
                                    <div className="rounded-full p-1.5 group-hover:bg-indigo-500/10">
                                        <ChartNoAxesColumn className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs">{views}</span>
                                </Button>
                            </Link>
                        </div>

                        {/* Derecha: Compartir y Mensajería */}
                        <div className="flex items-center gap-2">
                            {/* Compartir */}
                            <Button
                                variant="ghost"
                                onClick={shareLink}
                                className="rounded-full p-1.5 text-gray-500 hover:bg-indigo-500/10 hover:text-indigo-500"
                            >
                                <Share className="h-4 w-4" />
                            </Button>

                            {/* Mensajería */}
                            {author.id !== user?.id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full p-1.5 text-gray-500 hover:bg-indigo-500/10 hover:text-indigo-500"
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

            {/* Diálogo de imagen ampliada */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogTitle className="sr-only">
                    Attachment Preview
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Click on the image to close
                </DialogDescription>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none">
                    <div className="relative flex items-center justify-center w-full h-full">
                        {/* Botón de cerrar */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setImageDialogOpen(false)}
                            className="absolute top-2 right-2 z-50 bg-background/50 hover:bg-background/70 text-black rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </Button>

                        {/* Botón de descargar */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={downloadImage}
                            className="absolute bottom-2 right-2 z-50 bg-background/50 hover:bg-background/70 text-black rounded-full"
                        >
                            <Download className="h-5 w-5" />
                        </Button>

                        {/* Imagen ampliada */}
                        <div className="relative max-w-full max-h-[85vh] overflow-hidden rounded-lg">
                            <Image
                                src={attachment!}
                                alt="Attachment"
                                className="object-contain max-h-[85vh]"
                                width={1200}
                                height={900}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
