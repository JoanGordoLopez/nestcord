import { useState } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import {
  EllipsisVertical,
  AtSign,
  Trash,
  Flag,
  ChartNoAxesColumn,
} from "lucide-react";
import { createClient } from "@/database/client";
export default function StatusOptions({
  author,
  username,
  id,
}: {
  author: string;
  username: string;
  id: string;
}) {
  const { user } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false); // Estado para manejar el DropdownMenu

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleDelete = async (id: string) => {
    const db = createClient();

    try {
      await db.from("status").delete().eq("id", id);
    } finally {
      router.refresh();
    }
  };
  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto max-sm:ml-0 h-8 w-8 text-gray-500 hover:text-indigo-500 hover:cursor-pointer rounded-full hover:bg-indigo-500/10"
        >
          <EllipsisVertical className="w-8 h-8" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel className="text-sm font-medium">
          Options
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link href={`/${username}`}>
          <DropdownMenuItem className="hover:cursor-pointer">
            <AtSign className="w-4 h-4" />
            <span>@{username} Profile</span>
          </DropdownMenuItem>
        </Link>

        <Link href={`/status/${id}/analytics`}>
          <DropdownMenuItem className="hover:cursor-pointer">
            <ChartNoAxesColumn className="w-4 h-4" />
            <span>View post analytics</span>
          </DropdownMenuItem>
        </Link>

        {author === user?.id && (
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => handleDelete(id)}
          >
            <Trash className="w-4 h-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        )}

        {author !== user?.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault(); // Previene que el menú se cierre
                  setOpen(true); // Mantiene el menú abierto
                }}
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to report this status?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone. This will send a report to the
                  moderators and it will be reviewed as soon as possible.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
