import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { userSchema, type SelectUser } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const authRouter = createTRPCRouter({
  generateOtp: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.auth.signInWithOtp({
        email: input.email,
        options: { shouldCreateUser: true },
      });

      if (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return { message: "OTP sent successfully" };
    }),

  verifyOtp: publicProcedure
    .input(z.object({ email: z.string(), token: z.string() }))
    .mutation(async ({ ctx, input: { email, token } }) => {
      const { data, error } = await ctx.supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      if (!data.session) {
        console.log(data);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid OTP",
        });
      }

      const userEmail = data.session.user.email;

      if (!userEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to verify OTP",
        });
      }

      let existingUser = await ctx.db.query.userSchema.findFirst({
        where({ email }, { eq }) {
          return eq(email, userEmail);
        },
      });

      if (!existingUser?.email) {
        existingUser = (
          await ctx.db
            .insert(userSchema)
            .values({
              email: userEmail,
              id: data.user?.id!,
            })
            .returning()
        )[0];
      }

      return { message: "OTP verified successfully", data: existingUser };
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    const {
      data: { user },
    } = await ctx.supabase.auth.getUser();

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    await ctx.supabase.auth.signOut();

    return { message: "Logged out successfully" };
  }),

  me: protectedProcedure.query(
    async ({ ctx: { supabase } }) => await supabase.auth.getUser(),
  ),
});
