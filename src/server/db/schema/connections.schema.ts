import { pgTable, uuid, text, date } from "drizzle-orm/pg-core";

export const connectionsSchema = pgTable("connections", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  linkedinURL: text("linkedin_url").notNull(),
  company: text().notNull(),
  position: text().notNull(),
  connectedOn: date("connected_on").notNull(),
});
