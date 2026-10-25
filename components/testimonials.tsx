import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/image/person1.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/image/person2.png",
  },
  {
    quote:
      "The Santorini Sunset Cruise Was Pure Magic. Every Moment Felt Carefully Curated And The Local Food Was Unforgettable.",
    name: "Elena Rossi",
    location: "Rome, Italy",
    image: "/image/person1.png",
  },
  {
    quote:
      "Our Kyoto Cultural Tour Was Flawless From Start To Finish. Thoughtful Guides And Beautiful Stays Made It Truly Special.",
    name: "Adam Whitfield",
    location: "London, UK",
    image: "/image/person2.png",
  },
];

const arrowClassName =
  "static size-10 border-slate-300 bg-white text-slate-500 shadow-none hover:border-brand hover:bg-brand hover:text-white sm:size-11 [&_svg:not([class*='size-'])]:size-5";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-20 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10">
        <Carousel
          opts={{ align: "start", loop: true, duration: 35 }}
          className="w-full"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-normal leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl lg:text-5xl">
                What Travelers Say
              </h2>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Real experiences from our happy travelers
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <CarouselPrevious className={arrowClassName} />
              <CarouselNext className={arrowClassName} />
            </div>
          </div>

          <CarouselContent className="-ml-5 mt-10 md:mt-12 lg:-ml-7">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.name}
                className="pl-5 md:basis-1/2 lg:pl-7"
              >
                <article className="flex h-full flex-col overflow-hidden border border-slate-200 bg-white md:min-h-[300px] md:flex-row">
                  <div className="flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
                    <blockquote className="font-display text-base leading-relaxed text-slate-800 sm:text-lg">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>

                    <div className="mt-auto flex items-center gap-3 pt-7">
                      <span className="h-px w-6 shrink-0 bg-brand" aria-hidden />
                      <div>
                        <p className="text-sm font-medium text-brand">
                          {testimonial.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-56 w-full shrink-0 sm:h-64 md:h-auto md:w-[42%]">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="(min-width: 768px) 240px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
