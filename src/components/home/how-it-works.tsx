"use client";

import React, { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { motion } from "framer-motion";
import { Workflow, Columns3, ChevronsUp, ChevronDown } from "lucide-react";

interface StepCardProps {
  step: {
    number: number;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    details: string;
  };
  index: number;
}

function StepCard({ step, index }: StepCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.21, 1.02, 0.73, 1],
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="h-full"
    >
      <Card
        className="bg-card border-border/50 group h-full cursor-pointer border shadow-sm transition-all duration-200 hover:shadow-md"
        onClick={() => setIsExpanded(!isExpanded)}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="bg-brand-soft group-hover:bg-accent flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200">
                <Icon className="text-brand h-6 w-6" aria-hidden="true" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-foreground text-lg font-semibold">
                  {step.title}
                </h3>
                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>

              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="border-border/30 mt-3 border-t pt-3">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Upload LinkedIn Data",
      description: "Easily import your connections.",
      icon: Workflow,
      details:
        "Simply export your LinkedIn connections and upload the file. Our secure system processes your data instantly while keeping your information private and protected.",
    },
    {
      number: 2,
      title: "Describe Your Mission",
      description: "Tell us what you're working on.",
      icon: Columns3,
      details:
        "Share details about your project, goals, or what kind of opportunities you're seeking. The more specific you are, the better our AI can match you with relevant connections.",
    },
    {
      number: 3,
      title: "Get Smart Matches",
      description: "AI highlights the most relevant connections.",
      icon: ChevronsUp,
      details:
        "Our advanced AI analyzes your network and mission to surface the most valuable connections. Get personalized insights and conversation starters for each match.",
    },
  ];

  return (
    <section className="bg-background px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-foreground mb-4 text-3xl font-bold">
            How It Works
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Get started in three simple steps and unlock the power of your
            network
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
