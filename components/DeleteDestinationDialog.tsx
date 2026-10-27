"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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

const dangerActionClassName =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-[13px] font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60 sm:h-10 sm:px-4";

const DESTINATION_API = "http://localhost:5000/destination";

type DeleteDestinationResult = {
  acknowledged?: boolean;
  deletedCount?: number;
};

const DeleteDestinationDialog = ({ id }: { id: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteDestination = async () => {
    setIsDeleting(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        `${DESTINATION_API}/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to delete destination (${res.status})`);
      }

      const result = (await res.json()) as DeleteDestinationResult;

      if (result.deletedCount === 0) {
        throw new Error("Destination not found");
      }

      // The record is gone, so leave the detail page and show the fresh list.
      router.push("/destination");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete destination",
      );
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={dangerActionClassName}>
        <Trash2 className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            travel package from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-600/15"
          >
            {errorMessage}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteDestination}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDestinationDialog;
