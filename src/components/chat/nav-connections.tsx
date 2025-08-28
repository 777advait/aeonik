"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import type { TSelectConnections } from "~/server/db/schema";

export function NavConnections({
  connections,
}: {
  connections: TSelectConnections[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Connections</SidebarGroupLabel>
      <SidebarMenu>
        {connections.length > 0 ? (
          connections.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton>{item.name}</SidebarMenuButton>
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
