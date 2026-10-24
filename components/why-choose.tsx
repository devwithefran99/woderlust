import Image from "next/image";

const features = [
  {
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
    icon: "/image/ShieldCheck.png",
  },
  {
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
    icon: "/image/MapTrifold.png",
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
    icon: "/image/Headset.png",
  },
];

export function WhyChoose() {
  return (
    <section
      id="why-choose"
      className="relative overflow-hidden bg-mist py-20 md:py-24 lg:py-28"
    >
      <div className="relative mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-normal leading-tight tracking-[-0.02em] text-slate-900 sm:text-5xl lg:text-[56px]">
            Why Choose Wanderlust
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500 md:text-lg">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3 lg:gap-7">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group flex h-full flex-col rounded-2xl bg-white p-7 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,23,42,0.28)] md:p-8"
            >
              <Image
                src={feature.icon}
                alt=""
                width={48}
                height={48}
                className="size-12"
              />
              <h3 className="mt-8 font-display text-[26px] font-medium leading-tight text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
