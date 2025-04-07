"use client"

import type React from "react"

import { useUser } from "@/context/user-context"
import { useState, useCallback, useMemo } from "react"
import { mutate } from "swr"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Pencil, Camera, Check } from "lucide-react"

import { updateUser } from "@/actions/update-user"
import { uploadAvatar } from "@/actions/upload-avatar"
import { uploadBanner } from "@/actions/upload-banner"
import Image from "next/image"
import { z } from "zod" // Importa Zod

import { DialogTitle } from "@radix-ui/react-dialog"

const categories = [
    { value: "Student", label: "Student" },
    { value: "Software Developer", label: "Software Developer" },
    { value: "Marketing", label: "Marketing" },
    { value: "Business", label: "Business" },
    { value: "Designer", label: "Designer" },
    { value: "Teacher", label: "Teacher" },
    { value: "other", label: "Other" },
]

const userSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must be less than 50 characters" }),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(12, { message: "Username must be less than 12 characters" })
        .regex(/^[a-zA-Z0-9]*$/, {
            message: "Username can only contain letters and numbers",
        })
        .refine(
            (value) =>
                ![
                    "home",
                    "explore",
                    "notifications",
                    "terms",
                    "privacy",
                ].includes(value.toLowerCase()),
            {
                message: "This username is not available",
            }
        ),
})

export default function EditProfile() {
    const { user } = useUser()

    const [open, setOpen] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [openCategory, setOpenCategory] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; username?: string }>(
        {}
    ) // Para almacenar los errores

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        website: "",
        biography: "",
        category: "",
        location: "",
    })

    useMemo(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev, // Mantiene las propiedades existentes
                name: user.name || "",
                username: user.username || "",
                website: user.website || "",
                biography: user.biography || "",
                category: user.category || "",
            }))
        }
    }, [user])

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target
            setFormData((prev) => ({ ...prev, [name]: value }))
        },
        []
    )

    const handleBannerChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
                const reader = new FileReader()
                setBannerFile(file)
                reader.onloadend = () => {
                    setBannerPreview(reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        },
        []
    )

    const handleAvatarChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
                const reader = new FileReader()
                setAvatarFile(file)
                reader.onloadend = () => {
                    setAvatarPreview(reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        },
        []
    )

    const handleSave = useCallback(async () => {
        // Validar usando Zod
        const validation = userSchema.safeParse(formData)
        if (!validation.success) {
            const newErrors: Record<string, string> = {}
            validation.error.errors.forEach((err) => {
                newErrors[err.path[0]] = err.message
            })
            setErrors(newErrors)
            return
        }

        if (user) {
            // Upload avatar if changed
            if (avatarFile) {
                await uploadAvatar(avatarFile, user.id)
            }

            // Upload banner if changed
            if (bannerFile) {
                await uploadBanner(bannerFile, user.id)
            }

            const updatedFields = Object.entries(formData).reduce(
                (acc, [key, value]) => {
                    if (value !== user[key as keyof typeof user]) {
                        acc[key] = value
                    }
                    return acc
                },
                {} as Record<string, string>
            )

            if (Object.keys(updatedFields).length > 0) {
                const success = await updateUser(updatedFields)
                if (success) mutate("/api/user/session")
            }
        }
        setOpen(false)
    }, [formData, user, avatarFile, bannerFile])

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start p-2 text-left border-none text-sm font-normal hover:cursor-pointer"
                >
                    <Pencil className="w-5 h-5 mr-2 text-black dark:text-white" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0">
                <DialogTitle className="sr-only">Profile Settings</DialogTitle>
                <div className="relative h-40">
                    <Image
                        src={
                            bannerPreview ||
                            user.banner ||
                            "/images/default-profile-banner.webp"
                        }
                        alt="Cover image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                    />
                    <Label
                        htmlFor="banner"
                        className="absolute top-2 right-2 cursor-pointer bg-black/50 text-white p-2 rounded-full z-10"
                    >
                        <Input
                            id="banner"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleBannerChange}
                        />
                        <Camera className="h-5 w-5" />
                    </Label>
                    <Avatar className="absolute -bottom-16 left-4 h-32 w-32 border-4 border-white">
                        <AvatarImage src={avatarPreview || user.avatar} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Label
                        htmlFor="avatar"
                        className="absolute bottom-2 left-28 cursor-pointer bg-black/50 text-white p-2 rounded-full z-10"
                    >
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        <Camera className="h-5 w-5" />
                    </Label>
                </div>
                <div className="p-6 pt-20">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-700"
                            >
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="username"
                                className="text-sm font-medium text-gray-700"
                            >
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="text-sm text-red-600">
                                    {errors.username}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="website"
                                className="text-sm font-medium text-gray-700"
                            >
                                Website
                            </Label>
                            <Input
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="Enter your website"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="location"
                                className="text-sm font-medium text-gray-700"
                            >
                                Location
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Enter your location"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label
                                htmlFor="category"
                                className="text-sm font-medium text-gray-700"
                            >
                                Category
                            </Label>
                            <Popover
                                open={openCategory}
                                onOpenChange={setOpenCategory}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        value={formData.category}
                                        aria-expanded={openCategory}
                                        className="w-full justify-between"
                                    >
                                        {formData.category
                                            ? categories.find(
                                                  (category) =>
                                                      category.value ===
                                                      formData.category
                                              )?.label
                                            : "Select category..."}
                                        <Check
                                            className={`ml-2 h-4 w-4 ${formData.category ? "opacity-100" : "opacity-0"}`}
                                        />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search category..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                No category found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {categories.map((category) => (
                                                    <CommandItem
                                                        key={category.value}
                                                        onSelect={() => {
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    category:
                                                                        category.value,
                                                                })
                                                            )
                                                            setOpenCategory(
                                                                false
                                                            )
                                                        }}
                                                    >
                                                        <Check
                                                            className={`mr-2 h-4 w-4 ${
                                                                formData.category ===
                                                                category.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }`}
                                                        />
                                                        {category.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label
                                htmlFor="biography"
                                className="text-sm font-medium text-gray-700"
                            >
                                Biography
                            </Label>
                            <Textarea
                                id="biography"
                                name="biography"
                                value={formData.biography}
                                onChange={handleInputChange}
                                placeholder="Enter your biography"
                                className="resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="px-6 py-4 bg-gray-50">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
