import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userSchema = pgTable(
  "user",
  {
    id: uuid().primaryKey(),
    email: text().notNull().unique(),
    onboarded: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [uniqueIndex("email_idx").on(table.email)],
);

export type SelectUser = typeof userSchema.$inferSelect;
export type InsertUser = typeof userSchema.$inferInsert;
