import type { Metadata } from "next";

import { AddDestinationForm } from "@/components/add-destination-form";

export const metadata: Metadata = {
  title: "Add New Travel Package | Wanderlast",
  description:
    "Create a new travel package with destination details, pricing, and departure information.",
};

export default function AddDestinationPage() {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <h1 className="font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-slate-900 sm:text-5xl lg:text-[56px]">
          Add New Travel Package
        </h1>

        <AddDestinationForm />
      </div>
    </main>
  );
}
