"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function  AddDestinationForm() {
  const [category, setCategory] = useState<string | null>("Beach");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const res = await fetch('http://localhost:5000/add-destination' , {
      method : "POST", 
      headers : {
        'Content-Type' : "application/json"
      },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))
    })
    const data = await res.json()
    console.log(data)
  }

  function handleReset() {
    setCategory("Beach");
    setSubmitted(false);
  }

  return (
    <Card className="mx-auto mt-8 w-full max-w-[720px] rounded-xl border border-slate-200 bg-white py-0 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] ring-0 sm:mt-10">
      <CardContent className="p-5 sm:p-8 lg:p-10">
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
                className="min-h-[128px] rounded-lg border-slate-200 bg-slate-50/70 px-3 py-2.5 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-brand/60 focus-visible:bg-white focus-visible:ring-brand/15 sm:text-sm dark:bg-input/30"
              />
            </Field>
          </FieldGroup>

          {submitted && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 ring-1 ring-emerald-600/15"
            >
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              Travel package added successfully.
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="reset"
              variant="outline"
              className="h-11 w-full border-destructive/40 px-6 text-destructive hover:border-destructive/60 hover:bg-destructive/5 hover:text-destructive sm:w-auto"
            >
              <X aria-hidden="true" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 w-full bg-brand px-6 text-white hover:bg-brand-dark sm:w-auto"
            >
              <Plus aria-hidden="true" />
              Add Travel Package
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
