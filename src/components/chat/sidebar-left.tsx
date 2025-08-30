import * as React from "react";

import { NavConnections } from "~/components/chat/nav-connections";
import * as DialogComponent from "~/components/ui/dialog";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { createClient } from "~/utils/supabase/server";
import { db } from "~/server/db";
import { Plus } from "lucide-react";
import UploadArea from "./upload-area";
import { api, batchPrefetch } from "~/trpc/server";

// This is sample data.

export async function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  
  // const connections = await db.query.connectionsSchema.findMany({
  //   where: ({ userID }, { eq }) => eq(userID, user!.id),
  // });
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <DialogComponent.Dialog>
              <DialogComponent.DialogTrigger asChild>
                <SidebarMenuButton>
                  <Plus />
                  Add Connections
                </SidebarMenuButton>
              </DialogComponent.DialogTrigger>
              <DialogComponent.DialogContent>
                <DialogComponent.DialogHeader>
                  <DialogComponent.DialogTitle>
                    Upload Your LinkedIn Connections
                  </DialogComponent.DialogTitle>
                  <DialogComponent.DialogDescription>
                    Import your LinkedIn connections to discover powerful
                    opportunities and expand your professional network
                  </DialogComponent.DialogDescription>
                </DialogComponent.DialogHeader>
                <UploadArea />
              </DialogComponent.DialogContent>
            </DialogComponent.Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <NavConnections connections={connections} /> */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
