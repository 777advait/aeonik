"use client";

import * as CardComponent from "../ui/card";
import * as SheetComponent from "../ui/sheet";
import { cn } from "~/lib/utils";
import type { TSearchConnectionsTool } from "~/ai-core/types";
import { useTRPC } from "~/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

function ConnectionProfile({
  linkedinUrl,
  reason,
}: {
  linkedinUrl: string;
  reason: string;
}) {
  const api = useTRPC();
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery(api.connections.profile.queryOptions({ linkedinUrl }));

  if (isLoading)
    return (
      <div className="text-muted-foreground animate-pulse py-4 text-center">
        Fetching the profile please wait...
      </div>
    );

  if (error || !profile)
    return (
      <div className="text-destructive py-4 text-center">
        Failed to fetch profile. Please try again!
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-4">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-muted-foreground">{profile.headline}</p>
        <Button asChild className="w-full">
          <a href={linkedinUrl} target="_blank">
            Reconnect <ArrowUpRight />
          </a>
        </Button>
      </div>
      <div className="w-full space-y-2">
        <h1 className="text-xl font-medium">Why?</h1>
        <p className="leading-[150%]">{reason}</p>
      </div>
      {profile.educations && (
        <div className="w-full space-y-4">
          <h1 className="text-xl font-medium">Educations</h1>
          <div className="space-y-2">
            {profile.educations.map((education) => (
              <CardComponent.Card>
                <CardComponent.CardHeader>
                  <CardComponent.CardTitle>
                    {education.schoolName}
                  </CardComponent.CardTitle>
                  <CardComponent.CardDescription>
                    {education.degree} • {education.fieldOfStudy}
                  </CardComponent.CardDescription>
                </CardComponent.CardHeader>
              </CardComponent.Card>
            ))}
          </div>
        </div>
      )}
      {profile.position && (
        <div className="w-full space-y-4">
          <h1 className="text-xl font-medium">Positions</h1>
          <div className="space-y-2">
            {profile.position.map((position) => (
              <CardComponent.Card>
                <CardComponent.CardHeader>
                  <CardComponent.CardTitle>
                    {position.companyName}
                  </CardComponent.CardTitle>
                  <CardComponent.CardDescription>
                    {position.title} • {position.employmentType}
                  </CardComponent.CardDescription>
                </CardComponent.CardHeader>
              </CardComponent.Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfileCard({
  profile,
  className,
}: {
  profile: TSearchConnectionsTool["output"][number];
  className?: string;
}) {
  return (
    <SheetComponent.Sheet>
      <SheetComponent.SheetTrigger>
        <CardComponent.Card
          className={cn(
            "w-[260px] flex-none cursor-pointer rounded-xl border sm:w-[300px] md:w-[340px]",
            className,
          )}
        >
          <CardComponent.CardHeader className="space-y-1">
            <CardComponent.CardTitle className="text-lg leading-tight">
              {profile.name}
            </CardComponent.CardTitle>
            <CardComponent.CardDescription className="text-sm">
              {profile.position} • {profile.company}
            </CardComponent.CardDescription>
          </CardComponent.CardHeader>
          <CardComponent.CardContent>
            <p className="text-foreground/75 line-clamp-4 font-medium">
              {profile.reason}
            </p>
          </CardComponent.CardContent>
        </CardComponent.Card>
      </SheetComponent.SheetTrigger>
      <SheetComponent.SheetContent className="overflow-y-scroll">
        <SheetComponent.SheetHeader>
          <SheetComponent.SheetTitle>
            Connection Profile
          </SheetComponent.SheetTitle>
          <SheetComponent.SheetDescription>
            Take a peek into your connection's profile
          </SheetComponent.SheetDescription>
          <ConnectionProfile
            linkedinUrl={profile.linkedinURL}
            reason={profile.reason}
          />
        </SheetComponent.SheetHeader>
      </SheetComponent.SheetContent>
    </SheetComponent.Sheet>
  );
}
