import { generateText, tool } from "ai";
import z from "zod";
import { searchSimilarConnections } from "../search";
import type { TSelectUser } from "~/server/db/schema";
import { model } from "../model";

export const makeSearchConnectionsTool = (user: TSelectUser) =>
  tool({
    args: { name: "search-connections" },
    description: "Search for relevant semantic profiles of user's connections",
    inputSchema: z.object({
      query: z.string().describe("The query to search connections for"),
    }),
    execute: async ({ query }) => {
      const connections = await searchSimilarConnections(query, user);

      const withReasons = await Promise.all(
        connections.map(async (res) => {
          const { text: reason } = await generateText({
            model,
            system: `You are an assistant that explains why a user's connection is relevant.`,
            prompt: `
User profile: ${res.userSummary}
Search query: ${query}
Connection profile:
  - Name: ${res.name}
  - Position: ${res.position} at ${res.company}
  - Summary: ${res.summary}

Scores:
  - Query similarity: ${res.querySimilarity}
  - User similarity: ${res.userSimilarity}

Concisely explain in 1-2 sentences why this connection matches, highlighting overlap with the query and/or user's background. Be clear and human-sounding.`,
          });

          return {
            ...res,
            reason,
          };
        }),
      );

      return withReasons;
    },
  });
