import { pgTable, uuid, text, date, vector, index } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const connectionsSchema = pgTable(
  "connections",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    linkedinURL: text("linkedin_url").notNull(),
    company: text().notNull(),
    position: text().notNull(),
    connectedOn: date("connected_on").notNull(),
    userID: uuid("user_id")
      .references(() => userSchema.id, {
        onDelete: "cascade",
      })
      .notNull(),
    embedding: vector({ dimensions: 1536 }).notNull(),
    summary: text().notNull(),
  },
  (table) => [
    index("embeddingIdx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export type TSelectConnections = typeof connectionsSchema.$inferSelect;
export type TInsertConnections = typeof connectionsSchema.$inferInsert;
