"use client";

import React from "react";
import * as DialogComponent from "../ui/dialog";
import * as FormComponent from "../ui/form";
import { Button, ButtonLoading } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { SSignIn, type TSignIn } from "~/utils/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "~/utils/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";

type SignInStep = "email" | "otp";

export default function AuthDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<SignInStep>("email");
  const router = useRouter();
  const api = useTRPC();

  const form = useForm<TSignIn>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(SSignIn),
  });

  const { mutateAsync: generateOtp } = useMutation(
    api.auth.generateOtp.mutationOptions({
      onError: (error) => toast.error(error.message, { richColors: true }),
    }),
  );
  const { mutateAsync: verifyOtp } = useMutation(
    api.auth.verifyOtp.mutationOptions({
      onError: (error) => toast.error(error.message, { richColors: true }),
    }),
  );

  async function handleSubmit({ email, otp }: TSignIn) {
    if (step === "email") {
      await generateOtp({ email });
      setStep("otp");
    }

    if (step === "otp") {
      await verifyOtp({ email, token: otp! });

      toast.success("Verification successful", { richColors: true });

      router.push("/chat");

      setOpen(false);

      return;
    }
  }

  return (
    <DialogComponent.Dialog open={open} onOpenChange={setOpen}>
      <DialogComponent.DialogTrigger asChild>
        {children}
      </DialogComponent.DialogTrigger>

      <DialogComponent.DialogContent>
        <DialogComponent.DialogHeader>
          <DialogComponent.DialogTitle>Sign In</DialogComponent.DialogTitle>
          <DialogComponent.DialogDescription>
            Sign in to your account
          </DialogComponent.DialogDescription>
        </DialogComponent.DialogHeader>

        <FormComponent.Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormComponent.FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormComponent.FormItem className="space-y-1">
                  <FormComponent.FormLabel>Email</FormComponent.FormLabel>
                  <FormComponent.FormControl>
                    <Input
                      {...field}
                      disabled={step !== "email"}
                      placeholder="advait@aeonik.xyz"
                    />
                  </FormComponent.FormControl>
                  <FormComponent.FormMessage />
                </FormComponent.FormItem>
              )}
            />
            <FormComponent.FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormComponent.FormItem
                  className={cn({ hidden: step !== "otp" })}
                >
                  <FormComponent.FormLabel>
                    Verification Code
                  </FormComponent.FormLabel>
                  <FormComponent.FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      render={({ slots }) => (
                        <>
                          <InputOTPGroup>
                            {slots.map((slot, index) => (
                              <InputOTPSlot key={index} {...slot} />
                            ))}
                          </InputOTPGroup>
                        </>
                      )}
                    />
                  </FormComponent.FormControl>
                  <FormComponent.FormMessage />
                </FormComponent.FormItem>
              )}
            />

            <DialogComponent.DialogFooter>
              {form.formState.isSubmitting ? (
                <ButtonLoading>Signing in...</ButtonLoading>
              ) : (
                <Button type="submit">Sign In</Button>
              )}
            </DialogComponent.DialogFooter>
          </form>
        </FormComponent.Form>
      </DialogComponent.DialogContent>
    </DialogComponent.Dialog>
  );
}
