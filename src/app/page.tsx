"use client";
// src/app/page.tsx
import { HeroSection } from "@/components/sections/HeroSection";
import { TickerSection } from "@/components/sections/TickerSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { BranchesSection } from "@/components/sections/BranchesSection";
import { ApplySection } from "@/components/sections/ApplySection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TickerSection />
      <ScrollReveal>
        <ProductsSection />
      </ScrollReveal>
      <ScrollReveal>
        <CalculatorSection />
      </ScrollReveal>
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal>
        <ServicesSection />
      </ScrollReveal>
      <ScrollReveal>
        <NewsSection />
      </ScrollReveal>
      <ScrollReveal>
        <BranchesSection />
      </ScrollReveal>
      <ScrollReveal>
        <ApplySection />
      </ScrollReveal>
    </>
  );
}
