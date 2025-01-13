"use client";

import Hero from "@/components/sections/Hero";
import Weather from "@/components/sections/Weather";
import Forecast from "@/components/sections/Forecast";

export default function HomePage() {

  return (
    <>
      <Hero />
      <section className="flexBetween lg:flex-row flex-col py-4 padding-x gap-y-6">
        <Weather  />
        <Forecast />
      </section>
    </>
  );
}
