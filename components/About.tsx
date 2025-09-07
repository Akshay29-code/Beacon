import React from "react";
import { FeatureCarousel } from "@/components/ui/animated-feature-carousel";
import SectionWithMockup from "@/components/blocks/section-with-mockup"


export default function About(){
  const images = {
    alt: "Feature screenshot",
    step1img1: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1740&auto=format&fit=crop",
    step1img2: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?q=80&w=1740&auto=format&fit=crop",
    step2img1: "https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=1661&auto=format&fit=crop",
    step2img2: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1674&auto=format&fit=crop",
    step3img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1740&auto=format&fit=crop",
    step4img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1742&auto=format&fit=crop",
};

const exampleData1 = {
  title: (
      <>
          Checkpoint Hackathon
      </>
  ),
  description: (
      <>
          Beacon is a note taking app built at the Checkpoint Hackathon designed to turn productivity into play with street culture design, gamified focus, and AI powered notes. It’s not just another tool, it’s your signal to stay sharp and creative.
      </>
  ),
  primaryImageSrc: './about.jpeg',
  secondaryImageSrc: './about.jpeg',
};


  return (
    <section id="about" className="relative bg-[#121212] text-white">
      <SectionWithMockup
                  title={exampleData1.title}
                  description={exampleData1.description}
                  primaryImageSrc={exampleData1.primaryImageSrc}
                  secondaryImageSrc={exampleData1.secondaryImageSrc}
              />
          </section>
  );
}


