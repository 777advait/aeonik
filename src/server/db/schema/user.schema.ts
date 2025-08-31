import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const userSchema = pgTable(
  "user",
  {
    id: uuid().primaryKey(),
    email: text().notNull().unique(),
    onboarded: boolean().notNull().default(false),
    summary: text(),
    embedding: vector({ dimensions: 1536 }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("email_idx").on(table.email),
    index("embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export type TSelectUser = typeof userSchema.$inferSelect;
export type TInsertUser = typeof userSchema.$inferInsert;
