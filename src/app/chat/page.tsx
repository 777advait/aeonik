import { SidebarLeft } from "~/components/chat/sidebar-left";
import { SidebarRight } from "~/components/chat/sidebar-right";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import Chat from "~/components/chat/chat";
import { HydrateClient, api, batchPrefetch } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function Page() {
  batchPrefetch([
    api.auth.me.queryOptions(),
    api.connections.all.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
            </div>
          </header>
          <div className="relative mx-auto size-full max-w-4xl rounded-lg p-6">
            <Chat />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </HydrateClient>
  );
}
