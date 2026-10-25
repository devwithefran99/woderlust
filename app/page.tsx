import { Banner } from "@/components/banner";
import { Testimonials } from "@/components/testimonials";
import { WhyChoose } from "@/components/why-choose";

export default function Home() {
  return (
    <>
      
      <main>
        <Banner />
        <WhyChoose />
        <Testimonials />
      </main>
    </>
  );
}
