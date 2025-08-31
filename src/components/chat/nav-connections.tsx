"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useTRPC } from "~/trpc/client";
import * as SheetComponent from "~/components/ui/sheet";
import * as CardComponent from "~/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

function ConnectionProfile({ linkedinUrl }: { linkedinUrl: string }) {
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
    <div className="flex flex-col items-center justify-center space-y-6 py-4">
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

export function NavConnections() {
  const api = useTRPC();
  const { data: connections } = useSuspenseQuery(
    api.connections.all.queryOptions(),
  );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Connections</SidebarGroupLabel>
      <SidebarMenu>
        {connections.length > 0 ? (
          connections.map((connection) => (
            <SidebarMenuItem key={connection.id}>
              <SheetComponent.Sheet>
                <SheetComponent.SheetTrigger asChild>
                  <SidebarMenuButton>
                    <div className="flex flex-col items-start">
                      <p>{connection.name}</p>
                    </div>
                  </SidebarMenuButton>
                </SheetComponent.SheetTrigger>
                <SheetComponent.SheetContent className="overflow-y-scroll">
                  <SheetComponent.SheetHeader>
                    <SheetComponent.SheetTitle>
                      Connection Profile
                    </SheetComponent.SheetTitle>
                    <SheetComponent.SheetDescription>
                      Take a peek into your connection's profile
                    </SheetComponent.SheetDescription>
                    <ConnectionProfile linkedinUrl={connection.linkedinURL} />
                  </SheetComponent.SheetHeader>
                </SheetComponent.SheetContent>
              </SheetComponent.Sheet>
            </SidebarMenuItem>
          ))
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>No Connections added</SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
