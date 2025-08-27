"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { BotMessageSquare, MessageSquare, Pause, Repeat2 } from "lucide-react";

interface SuggestedPerson {
  id: string;
  name: string;
  role: string;
  company: string;
  relevance: string;
  avatar: string;
}

const DEMO_PEOPLE: SuggestedPerson[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    role: "Supply Chain Director",
    company: "Brasil Logistics SA",
    relevance: "Brazil market expert",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Ana Silva",
    role: "International Trade Manager",
    company: "São Paulo Port Authority",
    relevance: "Regulatory specialist",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Roberto Santos",
    role: "CEO",
    company: "BrazCargo Solutions",
    relevance: "Startup connections",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

const USER_MESSAGE = "Expanding my logistics business into Brazil.";
const AI_MESSAGE =
  "Great! I found some excellent contacts who can help with your Brazil expansion. Here are three highly relevant professionals:";

export default function DemoPreview() {
  const [demoState, setDemoState] = useState<
    "typing" | "userMessage" | "aiTyping" | "aiMessage" | "results" | "complete"
  >("typing");
  const [typedText, setTypedText] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetDemo = useCallback(() => {
    setDemoState("typing");
    setTypedText("");
    setSelectedCard(null);
  }, []);

  const startDemo = useCallback(() => {
    if (!isPlaying || isPaused || prefersReducedMotion) return;

    clearTimers();

    // Start typing animation
    let currentIndex = 0;
    intervalRef.current = setInterval(() => {
      if (currentIndex <= USER_MESSAGE.length) {
        setTypedText(USER_MESSAGE.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        // Show complete user message
        timeoutRef.current = setTimeout(() => {
          setDemoState("userMessage");

          // Start AI typing indicator
          timeoutRef.current = setTimeout(() => {
            setDemoState("aiTyping");

            // Show AI message
            timeoutRef.current = setTimeout(() => {
              setDemoState("aiMessage");

              // Show results
              timeoutRef.current = setTimeout(() => {
                setDemoState("results");

                // Complete and restart loop
                timeoutRef.current = setTimeout(() => {
                  setDemoState("complete");

                  timeoutRef.current = setTimeout(() => {
                    resetDemo();
                    startDemo();
                  }, 2000);
                }, 1500);
              }, 1000);
            }, 1500);
          }, 500);
        }, 300);
      }
    }, 50);
  }, [isPlaying, isPaused, prefersReducedMotion, resetDemo]);

  // Start demo on mount and when conditions change
  useEffect(() => {
    if (prefersReducedMotion) {
      setDemoState("complete");
      setTypedText(USER_MESSAGE);
      return;
    }

    startDemo();
    return clearTimers;
  }, [startDemo, prefersReducedMotion, clearTimers]);

  const handlePlayPause = useCallback(() => {
    if (prefersReducedMotion) return;

    setIsPaused(!isPaused);
    if (!isPaused) {
      clearTimers();
    } else {
      startDemo();
    }
  }, [isPaused, startDemo, clearTimers, prefersReducedMotion]);

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion) {
      setIsPaused(true);
      clearTimers();
    }
  }, [clearTimers, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!prefersReducedMotion) {
      setIsPaused(false);
      startDemo();
    }
  }, [startDemo, prefersReducedMotion]);

  const handleCardClick = useCallback(
    (personId: string) => {
      setSelectedCard(selectedCard === personId ? null : personId);
    },
    [selectedCard],
  );

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", damping: 20, stiffness: 300 };
  const fadeConfig = prefersReducedMotion ? { duration: 0 } : { duration: 0.5 };

  return (
    <div
      className="mx-auto w-full max-w-6xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="bg-card border-border relative overflow-hidden border">
        {/* Play/Pause Control */}
        {!prefersReducedMotion && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              className="bg-card/80 h-8 w-8 p-0 backdrop-blur-sm"
            >
              {isPaused ? (
                <Repeat2 className="h-3 w-3" />
              ) : (
                <Pause className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}

        <div className="grid gap-8 p-8 lg:grid-cols-2">
          {/* Chat Mock */}
          <div className="space-y-6">
            <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>Demo Chat</span>
            </div>

            <div
              className="bg-muted min-h-[300px] space-y-4 rounded-lg p-6"
              role="log"
              aria-live="polite"
              aria-label="Chat demo conversation"
            >
              {/* User Message */}
              <AnimatePresence>
                {(demoState === "typing" ||
                  demoState === "userMessage" ||
                  demoState === "aiTyping" ||
                  demoState === "aiMessage" ||
                  demoState === "results" ||
                  demoState === "complete") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            type: "spring" as const,
                            damping: 20,
                            stiffness: 300,
                          }
                    }
                    className="flex justify-end"
                  >
                    <div className="bg-primary text-primary-foreground max-w-[80%] rounded-lg px-4 py-2">
                      <p className="text-sm">
                        {demoState === "typing" ? typedText : USER_MESSAGE}
                        {demoState === "typing" && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="ml-1"
                          >
                            |
                          </motion.span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Typing Indicator */}
              <AnimatePresence>
                {demoState === "aiTyping" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            type: "spring" as const,
                            damping: 20,
                            stiffness: 300,
                          }
                    }
                    className="flex justify-start"
                  >
                    <div className="bg-card border-border flex max-w-[80%] items-center gap-2 rounded-lg border px-4 py-2">
                      <BotMessageSquare className="text-muted-foreground h-4 w-4" />
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0,
                          }}
                          className="bg-muted-foreground h-2 w-2 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="bg-muted-foreground h-2 w-2 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="bg-muted-foreground h-2 w-2 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Response */}
              <AnimatePresence>
                {(demoState === "aiMessage" ||
                  demoState === "results" ||
                  demoState === "complete") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            type: "spring" as const,
                            damping: 20,
                            stiffness: 300,
                          }
                    }
                    className="flex justify-start"
                  >
                    <div className="bg-card border-border max-w-[80%] rounded-lg border px-4 py-2">
                      <div className="flex items-start gap-2">
                        <BotMessageSquare className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                        <p className="text-sm">{AI_MESSAGE}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
              <BotMessageSquare className="h-4 w-4" />
              <span>AI Suggestions</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {(demoState === "results" || demoState === "complete") && (
                  <>
                    {DEMO_PEOPLE.map((person, index) => (
                      <motion.div
                        key={person.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          ...fadeConfig,
                          delay: prefersReducedMotion ? 0 : index * 0.1,
                        }}
                      >
                        <Card
                          className="border-border cursor-pointer border p-4 transition-all duration-200 hover:shadow-md"
                          onClick={() => handleCardClick(person.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleCardClick(person.id);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-expanded={selectedCard === person.id}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={person.avatar}
                              alt={`${person.name} avatar`}
                              className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-semibold">
                                    {person.name}
                                  </h4>
                                  <p className="text-muted-foreground text-xs">
                                    {person.role} • {person.company}
                                  </p>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="flex-shrink-0 text-xs"
                                >
                                  {person.relevance}
                                </Badge>
                              </div>

                              <AnimatePresence>
                                {selectedCard === person.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={fadeConfig}
                                    className="border-border mt-3 border-t pt-3"
                                  >
                                    <p className="text-muted-foreground text-xs">
                                      {person.id === "1" &&
                                        "15+ years experience in South American logistics networks. Led market entry for 3 major international companies."}
                                      {person.id === "2" &&
                                        "Expert in Brazilian customs regulations and port operations. Can navigate complex trade compliance requirements."}
                                      {person.id === "3" &&
                                        "Connected with emerging logistics startups and government officials. Active in Brazil-US trade associations."}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
