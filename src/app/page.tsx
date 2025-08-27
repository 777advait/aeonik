import HeroSection from "~/components/home/hero-section";
import HowItWorks from "~/components/home/how-it-works";
import DemoPreview from "~/components/home/demo-section";
import CredibilitySection from "~/components/home/credibility-section";
import FinalCta from "~/components/home/final-cta";

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section - Full bleed with header and main content */}
      <HeroSection />

      {/* How It Works - Centered with vertical spacing */}
      <section id="how-it-works" className="bg-background py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <HowItWorks />
        </div>
      </section>

      {/* Demo Preview - Wide centered demo card */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold">
              See It In Action
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Watch how AI analyzes your request and surfaces the most relevant
              connections from your network
            </p>
          </div>
          <DemoPreview />
        </div>
      </section>

      {/* Credibility Strip - Compact partner logos */}
      <section className="bg-background border-border/50 border-t py-16">
        <CredibilitySection />
      </section>

      {/* Final CTA - Full-width callout */}
      <FinalCta />
    </main>
  );
}
