"use client";
// src/components/ui/ScrollReveal.tsx
import { useEffect, useRef, type ReactNode } from "react";

export function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal" style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}
