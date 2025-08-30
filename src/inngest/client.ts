import { EventSchemas, Inngest } from "inngest";
import type { TInsertConnections } from "~/server/db/schema";

type Events = {
  "connection/add": { data: Omit<TInsertConnections, "embedding"> };
};

export const inngest = new Inngest({
  id: "aeonik",
  schemas: new EventSchemas().fromRecord<Events>(),
});
