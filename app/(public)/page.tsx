"use client";

import Hero from "@/components/Hero";
import FeaturedCelebrities from "@/components/FeaturedCelebrities";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FanCards from "@/components/FanCards";
import Subscribe from "@/components/Subscribe";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCelebrities />
      <HowItWorks />
      <Testimonials />
      <FanCards />
      <Subscribe />
    </main>
  );
}