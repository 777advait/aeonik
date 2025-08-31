"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { toast } from "sonner";
import { createClient } from "~/utils/supabase/client";
import AuthDialog from "../common/auth";

export default function FinalCta() {
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  return (
    <section className="bg-background w-full py-20 lg:py-24">
      <div className="container mx-auto max-w-4xl">
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
                  <AuthDialog>
                    <Button size="lg" className="text-lg">
                      Sign in to get started
                    </Button>
                  </AuthDialog>
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
