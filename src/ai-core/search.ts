import { and, cosineDistance, desc, eq, sql, gt } from "drizzle-orm";
import { createEmbedding, createEmbeddingMany } from "./embedding";
import { connectionsSchema, type TSelectUser } from "~/server/db/schema";
import { db } from "~/server/db";

export const searchSimilarConnections = async (
  query: string,
  user: TSelectUser,
) => {
  const {
    embeddings: [queryEmbedding, userEmbedding],
  } = await createEmbeddingMany([query, user.summary as string]);

  const querySimilarity = sql<number>`1 - (${cosineDistance(connectionsSchema.embedding, queryEmbedding!)})`;
  const userSimilarity = sql<number>`1 - (${cosineDistance(connectionsSchema.embedding, userEmbedding!)})`;
  const combinedScore = sql<number>`0.6 * ${querySimilarity!} + 0.4 * ${userSimilarity!}`; // bias towards query similarity

  return await db
    .select({
      company: connectionsSchema.company,
      linkedinURL: connectionsSchema.linkedinURL,
      name: connectionsSchema.name,
      position: connectionsSchema.position,
      connectedOn: connectionsSchema.connectedOn,
      summary: connectionsSchema.summary,
      userSummary: sql<string>`${user.summary}`,
      querySimilarity,
      userSimilarity,
      combinedScore,
    })
    .from(connectionsSchema)
    .where(eq(connectionsSchema.userID, user.id))
    .orderBy((t) => desc(t.combinedScore))
    .limit(4);
};
