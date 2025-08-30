import { tool } from "ai";
import z from "zod";
import { searchSimilarConnections } from "../search";
import { createClient } from "~/utils/supabase/server";

export const makeSearchConnectionsTool = (userID: string) =>
  tool({
    args: { name: "search-connections" },
    description: "Search for relevant semantic profiles of user's connections",
    inputSchema: z.object({
      query: z.string().describe("The query to search connections for"),
    }),
    execute: async ({ query }) => {
      const connections = searchSimilarConnections(query, userID);

      return connections;
    },
  });
