"use client";

import Image from "next/image";
import React from "react";
import Navbar from "@/components/ui/Navbar";
import { GlowButton } from "@/components/ui/shiny-button-1";
import RealismButton from "@/components/ui/shiny-borders-button";
import { ButtonCta } from "@/components/ui/button-shiny";

export default function Hero(){
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <Navbar/>
      <Image
        src="/hero-image.png"
        alt="Graffiti wall background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 px-6 text-center">
        <Image
          src="/lettering.svg"
          alt="BEACON"
          width={900}
          height={320}
          priority
          className="mx-auto h-auto w-[min(90vw,900px)] drop-shadow-[0_8px_24px_rgba(98,82,223,0.5)] mb-4"
        />
        <div className="flex items-center justify-center relative -top-52 scale-150">
          <ButtonCta className="w-fit text-sm" />
        </div>

      </div>
    </section>
  );
}


