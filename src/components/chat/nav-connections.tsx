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
              <SidebarMenuButton>
                <div className="flex flex-col items-start">
                  <p>{connection.name}</p>
                </div>
              </SidebarMenuButton>
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
