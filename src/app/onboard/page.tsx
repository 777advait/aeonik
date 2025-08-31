import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import OnboardForm from "~/components/onboard/onboard-form";

export default function OnboardPage() {
  return (
    <div className="mx-auto flex min-h-screen w-[35%] flex-col items-center justify-center gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">Aeonik</span>
          </a>
          <h1 className="text-2xl font-bold">Welcome to Aeonik</h1>
        </div>
      </div>
      <div className="w-full">
        <OnboardForm />
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        We will scrape your LinkedIn profile to create a semantic summary useful
        for recommending you your connections
      </div>
    </div>
  );
}
