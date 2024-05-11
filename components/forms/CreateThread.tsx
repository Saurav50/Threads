"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { threadValidation } from "@/lib/validations/thread";
import { createThreadDB } from "@/lib/actions/thread.action";
import { useOrganization } from "@clerk/nextjs";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const CreateThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  const onSubmit = async (values: z.infer<typeof threadValidation>) => {
    setLoading(true);

    await createThreadDB({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });
    setLoading(false);
    router.push("/");
  };
  return (
    <Form {...form}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex flex-col justify-start gap-8"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Content
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Textarea rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-purple-400 active:bg-purple-400  hover:bg-purple-400 "
          >
            Submit
          </Button>
        </form>
      )}
    </Form>
  );
};

export default CreateThread;
