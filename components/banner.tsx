import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const fieldClassName =
  "flex flex-col justify-center gap-0.5 border-slate-300/70 px-5 py-3.5 sm:px-6 lg:h-[72px] lg:border-l lg:border-slate-300/70 lg:py-0";

const inputClassName =
  "w-full bg-transparent text-[13px] leading-5 text-slate-600 outline-none placeholder:text-slate-500";

export function Banner() {
  return (
    <section className="relative isolate flex min-h-[620px] flex-col overflow-hidden md:min-h-[640px] lg:min-h-[660px]">
      <Image
        src="/image/Banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-black/35" />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-14 text-center md:py-16">
        <h1 className="font-display text-[40px] font-normal leading-[0.98] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[104px]">
          <span className="block">Discover Your</span>
          <span className="block">Next Adventure</span>
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-pretty text-white/90 sm:max-w-xl sm:text-base md:mt-6 md:max-w-[820px] md:text-lg">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-9">
          <Link
            href="#destinations"
            className="inline-flex h-11 items-center justify-center gap-3 rounded-[2px] bg-brand px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-dark md:h-12 md:px-8 md:text-sm"
          >
            Explore Now
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Link>
          <Link
            href="#destinations"
            className="inline-flex h-11 items-center justify-center rounded-[2px] border border-white/40 bg-white/80 px-7 text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 backdrop-blur-[2px] transition-colors hover:bg-white md:h-12 md:px-8 md:text-sm"
          >
            View Destination
          </Link>
        </div>
      </div>

      <form
        aria-label="Search destinations"
        className="relative w-full border-t border-slate-200/70 bg-white/90 backdrop-blur-md"
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_190px]">
          <div className={`${fieldClassName} border-b lg:border-b-0 lg:border-l-0`}>
            <label
              htmlFor="search-location"
              className="text-xs font-semibold text-slate-900"
            >
              Location
            </label>
            <input
              id="search-location"
              type="text"
              placeholder="Address, City Or Zip"
              className={inputClassName}
            />
          </div>

          <div className={`${fieldClassName} border-b border-l lg:border-b-0`}>
            <label
              htmlFor="search-date"
              className="text-xs font-semibold text-slate-900"
            >
              Date/Duration
            </label>
            <select
              id="search-date"
              defaultValue="Anytime/3 Days"
              className={`${inputClassName} cursor-pointer appearance-none`}
            >
              <option>Anytime/3 Days</option>
              <option>1 Day</option>
              <option>7 Days</option>
              <option>14 Days</option>
            </select>
          </div>

          <div className={`${fieldClassName} border-b lg:border-b-0`}>
            <label
              htmlFor="search-budget"
              className="text-xs font-semibold text-slate-900"
            >
              Budget
            </label>
            <select
              id="search-budget"
              defaultValue="$0-$3000"
              className={`${inputClassName} cursor-pointer appearance-none`}
            >
              <option>$0-$3000</option>
              <option>$3000-$5000</option>
              <option>$5000+</option>
            </select>
          </div>

          <div className={`${fieldClassName} border-b border-l lg:border-b-0`}>
            <label
              htmlFor="search-people"
              className="text-xs font-semibold text-slate-900"
            >
              People
            </label>
            <select
              id="search-people"
              defaultValue="5-10"
              className={`${inputClassName} cursor-pointer appearance-none`}
            >
              <option>1-4</option>
              <option>5-10</option>
              <option>10+</option>
            </select>
          </div>

          <button
            type="submit"
            className="col-span-2 flex h-14 items-center justify-center bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-dark lg:col-span-1 lg:h-[72px]"
          >
            Search
          </button>
        </div>
      </form>
    </section>
  );
}
