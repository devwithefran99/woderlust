import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  MapPin,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import { DestinationImage } from "@/components/destination-image";
import type { Destination } from "@/components/destination-explorer";

type DestinationDetails = Destination & {
  reviewCount?: number;
  highlights?: string[];
};

type DestinationResult =
  | { status: "ok"; destination: DestinationDetails }
  | { status: "not-found" }
  | { status: "unavailable" };

const DESTINATION_API = "http://localhost:5000/destination";

const categoryHighlights: Record<string, string[]> = {
  beach: [
    "Beachfront stays with room to slow down",
    "Sunset walks along the coast",
  ],
  mountain: ["A quiet mountain lodge", "A guided sunrise hike"],
  city: ["A central boutique stay", "An evening local food walk"],
  adventure: ["Expert-led outdoor activities", "Small-group departures"],
  cultural: ["A guided heritage walk", "Time with local artisans"],
  island: ["A day of island hopping", "Unhurried beach time"],
  wildlife: ["A guided wildlife safari", "A stay close to nature"],
  luxury: ["A premium suite stay", "Private transfers throughout"],
};

const bookingPerks = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
];

const secondaryActionClassName =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60 sm:h-10 sm:px-4";

const dangerActionClassName =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-[13px] font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60 sm:h-10 sm:px-4";

// React cache keeps the page and its metadata from fetching the same trip twice.
const getDestination = cache(
  async (id: string): Promise<DestinationResult> => {
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return { status: "not-found" };
    }

    try {
      const response = await fetch(`${DESTINATION_API}/${id}`, {
        cache: "no-store",
      });

      if (response.status === 404) {
        return { status: "not-found" };
      }

      if (!response.ok) {
        return { status: "unavailable" };
      }

      const body = await response.text();
      if (!body.trim()) {
        return { status: "not-found" };
      }

      const destination = JSON.parse(body) as DestinationDetails;
      if (!destination?._id) {
        return { status: "not-found" };
      }

      return { status: "ok", destination };
    } catch {
      return { status: "unavailable" };
    }
  },
);

export async function generateMetadata(
  { params }: PageProps<"/destination/[id]">,
): Promise<Metadata> {
  const { id } = await params;
  const result = await getDestination(id);

  if (result.status !== "ok") {
    return { title: "Destination | Wanderlast" };
  }

  const { destinationName, country, description } = result.destination;

  return {
    title: `${destinationName} | Wanderlast`,
    description:
      description?.trim() ||
      `Discover ${destinationName} in ${country} with Wanderlast.`,
  };
}

export default async function DestinationDetailsPage({
  params,
}: PageProps<"/destination/[id]">) {
  const { id } = await params;
  const result = await getDestination(id);

  if (result.status === "not-found") {
    notFound();
  }

  if (result.status === "unavailable") {
    return <DestinationUnavailable id={id} />;
  }

  const destination = result.destination;
  const rating =
    typeof destination.rating === "number" ? destination.rating : 4.8;
  const reviewCount = destination.reviewCount ?? 186;
  const highlights = buildHighlights(destination);

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="flex flex-wrap items-center justify-between gap-3 py-5 sm:py-7">
          <Link
            href="/destination"
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 transition-colors hover:text-brand sm:text-sm"
          >
            <ChevronLeft
              className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Back to Destinations
          </Link>

          {/* Editing and cancellation will be wired into the booking flow. */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Editing is coming soon"
              className={secondaryActionClassName}
            >
              <Pencil
                className="size-3.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              Edit
            </button>
            <Link href="/destination" className={dangerActionClassName}>
              <Trash2
                className="size-3.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              Cancel
            </Link>
          </div>
        </div>

        <div className="relative h-[250px] w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5 sm:h-[340px] lg:h-[420px]">
          <DestinationImage
            src={destination.imageUrl}
            alt={`${destination.destinationName}, ${destination.country}`}
            priority
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
              <MapPin
                className="size-3.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {destination.country}
            </p>

            <h1 className="mt-2 font-display text-[38px] font-normal leading-[1.05] tracking-[-0.02em] text-slate-900 sm:text-5xl lg:text-[56px]">
              {destination.destinationName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Star
                  className="size-4 fill-emerald-500 text-emerald-500"
                  aria-hidden="true"
                />
                <span className="font-semibold text-slate-800">
                  {rating.toFixed(1)}
                </span>
                <span>({reviewCount.toLocaleString("en-US")} reviews)</span>
              </span>

              <span
                className="hidden h-4 w-px bg-slate-200 sm:block"
                aria-hidden="true"
              />

              <span className="flex items-center gap-1.5">
                <CalendarDays
                  className="size-4"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {formatDuration(destination.duration)}
              </span>
            </div>

            <section className="mt-10" aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="text-xl font-semibold text-slate-900 sm:text-2xl"
              >
                Overview
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                {buildOverview(destination)}
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500">
                From the first planning call to the last day on the ground, our
                local team takes care of the details so you can stay in the
                moment.
              </p>
            </section>

            <section
              className="mt-10 border-t border-slate-100 pt-9"
              aria-labelledby="highlights-heading"
            >
              <h2
                id="highlights-heading"
                className="text-xl font-semibold text-slate-900 sm:text-2xl"
              >
                Highlights
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                A few of the moments we&apos;ve built into this trip.
              </p>

              <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-3.5 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-emerald-500"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingCard
              price={destination.price}
              departureDate={destination.departureDate}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function BookingCard({
  price,
  departureDate,
}: {
  price?: DestinationDetails["price"];
  departureDate?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Starting from
      </p>
      <p className="mt-2 text-[40px] font-semibold leading-none tracking-[-0.02em] text-brand">
        {formatPrice(price)}
      </p>
      <p className="mt-1.5 text-sm text-slate-500">per person</p>

      <div className="mt-6">
        <label
          htmlFor="departure-date"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
        >
          Departure
        </label>
        <input
          id="departure-date"
          type="date"
          defaultValue={toDateInputValue(departureDate)}
          className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
        />
      </div>

      <button
        type="button"
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
      >
        Book Now
        <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <p className="mt-3 text-center text-[11px] text-slate-400">
        No payment due today
      </p>

      <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5">
        {bookingPerks.map((perk) => (
          <li
            key={perk}
            className="flex items-center gap-2.5 text-[13px] text-slate-600"
          >
            <Check
              className="size-4 shrink-0 text-emerald-500"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DestinationUnavailable({ id }: { id: string }) {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 py-20 text-center sm:py-28">
        <span className="flex size-14 items-center justify-center rounded-full bg-mist text-brand">
          <MapPin className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl leading-tight text-slate-900 sm:text-4xl">
          We couldn&apos;t load this destination
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          The travel service is taking a little break. Please try again in a
          moment.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/destination/${id}`}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Try again
          </Link>
          <Link
            href="/destination"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    </main>
  );
}

function buildOverview(destination: DestinationDetails) {
  const description = destination.description?.trim();

  if (description) return description;

  return `Discover ${destination.destinationName} with a trip that balances the must-sees with time to simply be there.`;
}

function buildHighlights(destination: DestinationDetails) {
  if (destination.highlights?.length) {
    return destination.highlights;
  }

  const category = destination.category?.trim().toLowerCase() ?? "";
  const signature = categoryHighlights[category] ?? [
    "Handpicked stays chosen with care",
    "Local experiences beyond the guidebook",
  ];

  return [
    ...signature,
    "Local guides who know the hidden spots",
    "A pace that leaves room to explore",
  ];
}

function formatPrice(price?: DestinationDetails["price"]) {
  if (price === undefined || price === null || price === "") {
    return "On request";
  }

  const value = Number(price);
  if (!Number.isFinite(value)) return "On request";

  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatDuration(duration?: string) {
  if (!duration?.trim()) return "Flexible dates";

  const trimmed = duration.trim();
  const daysOnly = trimmed.match(/^(\d+)\s*days?$/i);

  if (!daysOnly) return trimmed;

  const days = Number(daysOnly[1]);
  if (days <= 1) return "1 Day";

  const nights = days - 1;
  return `${days} Days / ${nights} ${nights === 1 ? "Night" : "Nights"}`;
}

function toDateInputValue(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}
