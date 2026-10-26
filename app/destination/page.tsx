import type { Metadata } from "next";

import {
  DestinationExplorer,
  type Destination,
} from "@/components/destination-explorer";

export const metadata: Metadata = {
  title: "Explore All Destinations | Wanderlast",
  description:
    "Find your perfect travel experience from our curated collection of destinations.",
};

// New packages are added at runtime, so always read the latest list.
export const dynamic = "force-dynamic";

async function getDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch("http://localhost:5000/destination", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to load destinations (${res.status})`);
    }

    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as Destination[]) : [];
  } catch (error) {
    console.error("Unable to load destinations:", error);
    return [];
  }
}

const AllDestinationPage = async () => {
  const destinations = await getDestinations();

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <header>
          <h1 className="font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-slate-900 sm:text-5xl lg:text-[56px]">
            Explore All Destinations
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
            Find your perfect travel experience from our curated collection
          </p>
        </header>

        <DestinationExplorer destinations={destinations} />
      </div>
    </main>
  );
};

export default AllDestinationPage;
