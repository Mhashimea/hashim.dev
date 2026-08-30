import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { Timeline } from "@/components/Timeline";
import { ContentHub } from "@/components/ContentHub";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <CaseStudies />
        <Timeline />
        <ContentHub />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
