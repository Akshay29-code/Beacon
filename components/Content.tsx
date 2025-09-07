"use client";

import Image from "next/image";
import React from "react";
import { FullScreenScrollFX, FullScreenFXAPI } from "@/components/ui/full-screen-scroll-fx";

export default function Content(){
    const sections = [
        {
          leftLabel: "Focus",
          title: <>Focus</>,
          rightLabel: "Focus",
          background: "./focus.jpeg",
        },
        {
          leftLabel: "Organize",
          title: <>Organize</>,
          rightLabel: "Organize",
          background: "./organize.jpeg",
        },
        {
          leftLabel: "Reflect",
          title: <>Reflect</>,
          rightLabel: "Reflect",
          background: "./reflect.jpeg",
        },
        {
          leftLabel: "Achieve",
          title: <>Achieve</>,
          rightLabel: "Achieve",
          background: "./achieve.jpeg",
        },
      ];
      const apiRef = React.useRef<FullScreenFXAPI>(null);

      
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <FullScreenScrollFX
        sections={ sections }
        footer={<div></div>}
        showProgress
        durations={{ change: 0.7, snap: 800 }}
      />
    </section>
  );
}


