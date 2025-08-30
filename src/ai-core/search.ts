import { and, cosineDistance, desc, eq, sql, gt } from "drizzle-orm";
import { createEmbedding } from "./embedding";
import { connectionsSchema } from "~/server/db/schema";
import { db } from "~/server/db";

export const searchSimilarConnections = async (
  query: string,
  userID: string,
) => {
  const { embedding } = await createEmbedding(query);

  const similarity = sql<number>`1 - (${cosineDistance(connectionsSchema.embedding, embedding)})`;

  return await db
    .select({
      company: connectionsSchema.company,
      linkedinURL: connectionsSchema.linkedinURL,
      name: connectionsSchema.name,
      position: connectionsSchema.position,
      connectedOn: connectionsSchema.connectedOn,
      similarity,
    })
    .from(connectionsSchema)
    .where(and(gt(similarity, 0.5), eq(connectionsSchema.userID, userID)))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
};

// console.log(
//   await searchSimilarConnections(
//     "want to connect with founders in b2b ai saas space",
//     "1e9ce5d9-8993-409c-9b0c-9c2a5087dca6",
//   ),
// );

// db.$client.end();
