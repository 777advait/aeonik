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

type SignInStep = "email" | "otp";

export default function AuthDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<SignInStep>("email");
  const [email, setEmail] = React.useState("");
  const supabase = createClient();
  const router = useRouter();

  const form = useForm<TSignIn>({
    defaultValues: {
      email,
    },
    resolver: zodResolver(SSignIn),
  });

  async function handleSubmit({ email, otp }: TSignIn) {
    if (step === "email") {
      const { error: generateError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (generateError) {
        toast.error(generateError.message, { richColors: true });
        return;
      }

      toast.success("OTP sent successfully", {
        description: "Check your email for the verification code",
      });
      setStep("otp");
      return;
    }

    if (step === "otp") {
      const { error: verifyError, data: verifyData } =
        await supabase.auth.verifyOtp({ email, token: otp!, type: "email" });

      if (verifyError) {
        form.setError(
          "otp",
          {
            message: verifyError.message,
            type: "validate",
          },
          {
            shouldFocus: true,
          },
        );
        return;
      }

      toast.success("Verification successful");

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
                      placeholder="advait@alignnetwork.xyz"
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
