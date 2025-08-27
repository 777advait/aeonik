"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { toast } from "sonner";
import { createClient } from "~/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function FinalCta() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const supabase = createClient();

  const handleSignIn = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: { redirectTo: "http://localhost:3000/api/auth/callback" },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Successfully signed in with LinkedIn");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-background w-full py-20 lg:py-24">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <Card className="bg-card border-border border p-12 shadow-sm lg:p-16">
            <div className="space-y-8">
              {/* Headline */}
              <div className="space-y-4">
                <h2 className="text-foreground text-3xl leading-tight font-bold lg:text-4xl">
                  Your next opportunity is already in your network.
                </h2>
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                  No spam. Your data stays private.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="border-primary-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-primary-foreground"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span>Sign in with LinkedIn</span>
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* Privacy Disclosure */}
                <div className="text-center">
                  <button
                    onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                    className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4 transition-colors"
                  >
                    Why we ask
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: showPrivacyInfo ? "auto" : 0,
                      opacity: showPrivacyInfo ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="bg-muted text-muted-foreground mx-auto mt-4 max-w-xl rounded-lg p-4 text-sm">
                      <p>
                        aeonik uses your LinkedIn profile to analyze your
                        professional network and identify potential
                        opportunities. Your data is processed securely and never
                        shared with third parties. You maintain full control
                        over your information and can disconnect at any time.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
