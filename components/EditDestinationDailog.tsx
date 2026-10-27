"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Pencil, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Destination } from "@/components/destination-explorer";

const categories = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Island",
  "Wildlife",
  "Luxury",
];

const inputClassName =
  "h-11 rounded-lg border-slate-200 bg-slate-50/70 px-3 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-brand/60 focus-visible:bg-white focus-visible:ring-brand/15 sm:text-sm dark:bg-input/30";

const selectTriggerClassName =
  "h-11 w-full rounded-lg border-slate-200 bg-slate-50/70 px-3 text-base text-slate-900 shadow-none data-placeholder:text-slate-400 focus-visible:border-brand/60 focus-visible:bg-white focus-visible:ring-brand/15 sm:text-sm dark:bg-input/30";

// The API may return a full ISO timestamp, but <input type="date"> only
// accepts YYYY-MM-DD.
function toDateInputValue(value?: string) {
  return value?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? "";
}

function initialCategory(destination: Destination) {
  return destination.category?.trim() || "Beach";
}

const DESTINATION_API = "http://localhost:5000/destination";

type UpdateDestinationResult = {
  acknowledged?: boolean;
  matchedCount?: number;
  modifiedCount?: number;
};

type SubmitStatus = "idle" | "saving" | "success" | "error";

const EditDestinationDailog = ({ destination }: { destination: Destination }) => {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(() =>
    initialCategory(destination),
  );
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    const formValues = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as Record<string, string>;

    const payload = {
      ...formValues,
      price: Number(formValues.price),
    };

    try {
      const res = await fetch(
        `${DESTINATION_API}/${encodeURIComponent(destination._id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to update destination (${res.status})`);
      }

      const result = (await res.json()) as UpdateDestinationResult;

      if (result.matchedCount === 0) {
        throw new Error("Destination not found");
      }

      setStatus("success");
      // Re-fetch the server component so the page shows the updated values.
      router.refresh();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update destination",
      );
    }
  };

  function handleReset() {
    setCategory(initialCategory(destination));
    setStatus("idle");
    setErrorMessage("");
  }

  // The dialog unmounts its content when closed, but this component stays
  // mounted. Re-seed the controlled category so a cancelled edit does not leak
  // into the next open.
  function handleOpenChange(open: boolean) {
    if (open) {
      setCategory(initialCategory(destination));
      setStatus("idle");
      setErrorMessage("");
    }
  }

  return (
    <div>
      <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger
          aria-label="Edit destination"
          className="border p-2 flex justify-center items-center gap-2 rounded-md"
        >
          <Pencil
            className="size-3.5"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          Edit
        </DialogTrigger>
        <DialogContent className="min-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>
              Update the details of this travel package.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="flex flex-col gap-6"
          >
            <FieldGroup className="gap-5 sm:gap-6">
              <Field>
                <FieldLabel htmlFor="destination-name">
                  Destination Name
                </FieldLabel>
                <Input
                  id="destination-name"
                  name="destinationName"
                  placeholder="Bali Paradise"
                  autoComplete="off"
                  required
                  defaultValue={destination.destinationName}
                  className={inputClassName}
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <Field>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Indonesia"
                    autoComplete="country-name"
                    required
                    defaultValue={destination.country}
                    className={inputClassName}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select
                    name="category"
                    value={category}
                    onValueChange={setCategory}
                    required
                  >
                    <SelectTrigger
                      id="category"
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      {categories.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <Field>
                  <FieldLabel htmlFor="price">Price (USD)</FieldLabel>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 1299"
                    required
                    defaultValue={destination.price ?? ""}
                    className={inputClassName}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="duration">Duration</FieldLabel>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g., 7 Days/6 Nights"
                    required
                    defaultValue={destination.duration ?? ""}
                    className={inputClassName}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="departure-date">Departure Date</FieldLabel>
                <Input
                  id="departure-date"
                  name="departureDate"
                  type="date"
                  required
                  defaultValue={toDateInputValue(destination.departureDate)}
                  className={`${inputClassName} text-slate-600`}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="image-url">Image URL</FieldLabel>
                <Input
                  id="image-url"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  defaultValue={destination.imageUrl ?? ""}
                  className={inputClassName}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the travel experience..."
                  rows={5}
                  required
                  defaultValue={destination.description ?? ""}
                  className="min-h-[128px] rounded-lg border-slate-200 bg-slate-50/70 px-3 py-2.5 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-brand/60 focus-visible:bg-white focus-visible:ring-brand/15 sm:text-sm dark:bg-input/30"
                />
              </Field>
            </FieldGroup>

            {status === "success" && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 ring-1 ring-emerald-600/15"
              >
                <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                Travel package updated successfully.
              </div>
            )}

            {status === "error" && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-600/15"
              >
                <X className="size-4 shrink-0" aria-hidden="true" />
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="reset"
                variant="outline"
                disabled={status === "saving"}
                className="h-11 w-full border-destructive/40 px-6 text-destructive hover:border-destructive/60 hover:bg-destructive/5 hover:text-destructive sm:w-auto"
              >
                <X aria-hidden="true" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={status === "saving"}
                className="h-11 w-full bg-brand px-6 text-white hover:bg-brand-dark sm:w-auto"
              >
                <Plus aria-hidden="true" />
                {status === "saving" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDestinationDailog;
