"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const partners = [
  {
    name: "LinkedIn",
    logo: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=200&h=80&fit=crop&crop=center",
    alt: "LinkedIn logo",
  },
  {
    name: "Y Combinator",
    logo: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=200&h=80&fit=crop&crop=center",
    alt: "Y Combinator logo",
  },
  {
    name: "Sequoia",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop&crop=center",
    alt: "Sequoia Capital logo",
  },
  {
    name: "Andreessen Horowitz",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=80&fit=crop&crop=center",
    alt: "Andreessen Horowitz logo",
  },
];

const FallbackLogo = ({ name }: { name: string }) => (
  <div className="bg-muted flex h-12 w-24 items-center justify-center rounded border">
    <span className="text-muted-foreground text-xs font-medium">{name}</span>
  </div>
);

export default function CredibilitySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background w-full py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Supporting text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:flex-1"
          >
            <p className="text-muted-foreground max-w-md text-center text-sm leading-relaxed lg:text-left">
              Built for professionals who want to activate their network
              intelligently.
            </p>
          </motion.div>

          {/* Partner logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-6 lg:flex-1 lg:justify-end"
          >
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isVisible
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.1,
                  ease: "easeOut",
                }}
                className="group relative"
              >
                <div className="relative h-12 w-24 overflow-hidden rounded opacity-40 transition-opacity duration-200 hover:opacity-60">
                  <Image
                    src={partner.logo}
                    alt={partner.alt}
                    fill
                    className="object-contain grayscale"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const container = target.parentElement;
                      if (container) {
                        container.innerHTML = "";
                        const fallback = document.createElement("div");
                        fallback.className =
                          "flex items-center justify-center w-full h-full bg-muted rounded border";
                        fallback.innerHTML = `<span class="text-xs text-muted-foreground font-medium">${partner.name}</span>`;
                        container.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
