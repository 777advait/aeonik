import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { linkedinScraper } from "~/services/linkedin-scraper";

export const connectionsRouter = createTRPCRouter({
  all: protectedProcedure.query(
    async ({ ctx: { user, db } }) =>
      await db.query.connectionsSchema.findMany({
        where: ({ userID }, { eq }) => eq(userID, user.id),
      }),
  ),

  profile: protectedProcedure
    .input(z.object({ linkedinUrl: z.url() }))
    .query(
      async ({ input: { linkedinUrl } }) =>
        await linkedinScraper.fetchProfile(linkedinUrl),
    ),
});
