"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import * as FormComponent from "~/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader, Rocket } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OnboardForm() {
  const formSchema = z.object({
    linkedinUrl: z.url(),
  });

  const api = useTRPC();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { linkedinUrl: "" },
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: onboard, isPending: isOnboarding } = useMutation(
    api.auth.onboard.mutationOptions({
      onSuccess: () => {
        toast.success("Successfully onboarded!", { richColors: true });
        router.push("/chat");
      },
      onError: (error) => toast.error(error.message, { richColors: true }),
    }),
  );

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    await onboard(data);
  }

  return (
    <FormComponent.Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormComponent.FormField
          name="linkedinUrl"
          control={form.control}
          render={({ field }) => (
            <FormComponent.FormItem className="space-y-1">
              <FormComponent.FormLabel>LinkedIn URL</FormComponent.FormLabel>
              <FormComponent.FormControl>
                <Input
                  placeholder="https://linkedin.com/in/777advait"
                  {...field}
                />
              </FormComponent.FormControl>

              <FormComponent.FormMessage />
            </FormComponent.FormItem>
          )}
        />
        <Button disabled={isOnboarding} className="w-full">
          {isOnboarding ? (
            <span>
              <Loader className="size-4 animate-spin" />
            </span>
          ) : (
            <>
              Launch
              <span>
                <Rocket />
              </span>
            </>
          )}
        </Button>
      </form>
    </FormComponent.Form>
  );
}
