"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import AuthDialog from "../common/auth";

// Animated network background component
const AnimatedNetwork = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="network-pattern"
            x="0"
            y="0"
            width="120"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="60" cy="40" r="1.5" fill="currentColor" opacity="0.1" />
            <line
              x1="60"
              y1="40"
              x2="180"
              y2="40"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.05"
            />
            <line
              x1="60"
              y1="40"
              x2="120"
              y2="80"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.05"
            />
          </pattern>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#network-pattern)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.02, 1],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Subtle gradient overlay */}
      <motion.div
        className="from-primary/5 to-accent/10 absolute inset-0 bg-gradient-to-br via-transparent"
        animate={
          shouldReduceMotion
            ? {}
            : {
                opacity: [0.2, 0.4, 0.2],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

interface HeroSectionProps {
  onSignIn?: () => void;
  onScrollToHowItWorks?: () => void;
}

export default function HeroSection({
  onSignIn,
  onScrollToHowItWorks,
}: HeroSectionProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleScrollToHowItWorks = () => {
    if (onScrollToHowItWorks) {
      onScrollToHowItWorks();
    } else {
      // Fallback smooth scroll behavior
      const howItWorksElement = document.getElementById("how-it-works");
      if (howItWorksElement) {
        howItWorksElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="bg-background relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <AnimatedNetwork />

      <div className="relative z-10">
        {/* Header */}
        <header className="w-full pt-6 pb-4">
          <div className="container mx-auto flex max-w-6xl items-center justify-between">
            <div className="text-foreground text-xl font-bold">aeonik</div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="container mx-auto max-w-6xl px-8 py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column - Main Content */}
            <div className="space-y-8 lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6"
              >
                <h1 className="text-foreground text-4xl leading-tight font-bold lg:text-5xl xl:text-6xl">
                  Turn Your Network into{" "}
                  <span className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-transparent">
                    Powerful Opportunities
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
                className="text-muted-foreground max-w-2xl text-lg leading-relaxed lg:text-xl"
              >
                Upload your LinkedIn connections, tell us your mission, and let
                AI surface the people who can help you achieve your goals.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
                className="flex flex-col gap-4 pt-4 sm:flex-row"
              >
                <AuthDialog>
                  <Button>Start reconnecting</Button>
                </AuthDialog>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleScrollToHowItWorks}
                  className="border-border hover:bg-muted hover:border-muted-foreground/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                >
                  See how it works
                </Button>
              </motion.div>
            </div>

            {/* Right Column - Visual Space */}
            <div className="hidden lg:col-span-4 lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                {/* Placeholder for potential visual elements */}
                <div className="from-primary/10 to-primary/5 border-border/50 h-96 w-full rounded-2xl border bg-gradient-to-br backdrop-blur-sm" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
