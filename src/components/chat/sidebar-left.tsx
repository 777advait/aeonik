import * as React from "react";
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";

import { NavConnections } from "~/components/chat/nav-connections";
import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavWorkspaces } from "~/components/nav-workspaces";
import { TeamSwitcher } from "~/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { createClient } from "~/utils/supabase/server";
import { db } from "~/server/db";

// This is sample data.

export async function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const connections = await db.query.connectionsSchema.findMany({
    where: ({ userID }, { eq }) => eq(userID, user!.id),
  });
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavUser
          user={{
            email: user?.email as string,
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavConnections connections={connections} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
