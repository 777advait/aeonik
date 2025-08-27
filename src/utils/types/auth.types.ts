import z from "zod";

export const SSignIn = z.object({
  email: z.email(),
  otp: z.string().min(6).max(6).optional(),
});

export type TSignIn = z.infer<typeof SSignIn>;
