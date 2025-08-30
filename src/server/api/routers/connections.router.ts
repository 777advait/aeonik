import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const connectionsRouter = createTRPCRouter({
  all: protectedProcedure.query(
    async ({ ctx: { user, db } }) =>
      await db.query.connectionsSchema.findMany({
        where: ({ userID }, { eq }) => eq(userID, user.id),
      }),
  ),
});
