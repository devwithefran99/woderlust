"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  RotateCcw,
  Star,
} from "lucide-react";

import { DestinationImage } from "@/components/destination-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Destination = {
  _id: string;
  destinationName: string;
  country: string;
  category?: string;
  price?: string | number;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
  rating?: number;
};

const priceRanges = [
  { value: "all", label: "Price Range" },
  { value: "under-2500", label: "Under $2,500" },
  { value: "2500-5000", label: "$2,500 – $5,000" },
  { value: "over-5000", label: "$5,000 & Above" },
] as const;

const sortOptions = [
  { value: "recommended", label: "Sort By" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
] as const;

const filterTriggerClassName =
  "h-12 w-full justify-between rounded-[2px] border-slate-200 bg-white px-4 text-[11px] font-medium tracking-[0.12em] text-slate-500 uppercase hover:border-slate-300 data-[size=default]:h-12 focus-visible:border-brand focus-visible:ring-brand/15 [&_svg]:text-slate-500";

function getPrice(destination: Destination) {
  const price = Number(destination.price);
  return Number.isFinite(price) ? price : 0;
}

function formatPrice(price: number) {
  return `$${Math.round(price)}`;
}

function formatDuration(duration?: string) {
  if (!duration) return "Duration on request";

  const trimmed = duration.trim();
  return /^\d+$/.test(trimmed) ? `${trimmed} Days` : trimmed;
}

export function DestinationExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  const categories = useMemo(() => {
    const unique = new Set(
      destinations
        .map((destination) => destination.category?.trim())
        .filter((value): value is string => Boolean(value)),
    );

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [destinations]);

  const visibleDestinations = useMemo(() => {
    const filtered = destinations.filter((destination) => {
      if (category !== "all" && destination.category?.trim() !== category) {
        return false;
      }

      const price = getPrice(destination);

      if (priceRange === "under-2500" && price >= 2500) return false;
      if (priceRange === "2500-5000" && (price < 2500 || price > 5000)) {
        return false;
      }
      if (priceRange === "over-5000" && price <= 5000) return false;

      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return getPrice(a) - getPrice(b);
        case "price-desc":
          return getPrice(b) - getPrice(a);
        case "name-asc":
          return a.destinationName.localeCompare(b.destinationName);
        default:
          return 0;
      }
    });
  }, [category, destinations, priceRange, sortBy]);

  const hasActiveFilters =
    category !== "all" || priceRange !== "all" || sortBy !== "recommended";

  function resetFilters() {
    setCategory("all");
    setPriceRange("all");
    setSortBy("recommended");
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select
          items={[
            { value: "all", label: "Category" },
            ...categories.map((option) => ({ value: option, label: option })),
          ]}
          value={category}
          onValueChange={(value) => setCategory(value ?? "all")}
        >
          <SelectTrigger
            aria-label="Filter destinations by category"
            className={filterTriggerClassName}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">Category</SelectItem>
            {categories.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={priceRanges}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value ?? "all")}
        >
          <SelectTrigger
            aria-label="Filter destinations by price range"
            className={filterTriggerClassName}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {priceRanges.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={sortOptions}
          value={sortBy}
          onValueChange={(value) => setSortBy(value ?? "recommended")}
        >
          <SelectTrigger
            aria-label="Sort destinations"
            className={filterTriggerClassName}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500" aria-live="polite">
          Showing {visibleDestinations.length}{" "}
          {visibleDestinations.length === 1 ? "destination" : "destinations"}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-brand"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset filters
          </button>
        )}
      </div>

      {visibleDestinations.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDestinations.map((destination) => (
            <DestinationCard
              key={destination._id}
              destination={destination}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white text-brand shadow-sm ring-1 ring-slate-900/5">
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl text-slate-900">
            {destinations.length === 0
              ? "No destinations yet"
              : "No destinations found"}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {destinations.length === 0
              ? "Travel packages you add will appear here. Start by creating your first destination."
              : "Try changing the category or price range to see more travel packages."}
          </p>

          {destinations.length === 0 ? (
            <Link
              href="/add-destination"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[2px] bg-brand px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
            >
              Add a destination
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[2px] bg-brand px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark"
            >
              Clear filters
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  const rating =
    typeof destination.rating === "number" ? destination.rating : 4.5;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3px] bg-slate-100">
        <DestinationImage
          src={destination.imageUrl}
          alt={destination.destinationName}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-[2px] bg-white px-2 py-1 text-[11px] font-semibold leading-none text-slate-900 shadow-sm">
          {rating}
          <Star
            className="size-3 fill-slate-900 text-slate-900"
            aria-hidden="true"
          />
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {destination.country}
        </p>

        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-medium leading-tight text-slate-900 transition-colors group-hover:text-brand">
            {destination.destinationName}
          </h3>
          <p className="shrink-0 text-[17px] font-semibold leading-tight text-slate-900">
            {formatPrice(getPrice(destination))}
            <span className="ml-0.5 align-baseline text-[10px] font-normal text-slate-500">
              /Person
            </span>
          </p>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <CalendarDays
            className="size-3.5 shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          {formatDuration(destination.duration)}
        </p>

        <Link
          href={`/destination/${destination._id}`}
          className="mt-4 inline-flex w-fit items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-brand transition-colors hover:text-brand-dark"
        >
          Book Now
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
