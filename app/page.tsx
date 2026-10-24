import { Banner } from "@/components/banner";
import { Navbar } from "@/components/navbar";
import { WhyChoose } from "@/components/why-choose";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Banner />
        <WhyChoose />
      </main>
    </>
  );
}
