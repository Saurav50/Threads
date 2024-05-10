"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { usePathname } from "next/navigation";
import { commentValidation } from "@/lib/validations/thread";
import { postComment } from "@/lib/actions/thread.action";
import Image from "next/image";
import Link from "next/link";

const CommentForm = ({
  threadId,
  currentUserImage,
  currentUserId,
}: {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}) => {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    await postComment(
      threadId,
      JSON.parse(currentUserId),
      values.thread,
      pathname
    );
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel className="text-base-semibold relative  text-light-2 h-11 w-11">
                <div className="flex flex-col items-center">
                  <Link
                    href={`profile/${currentUserId}`}
                    className="relative h-11 w-11"
                  >
                    <Image
                      src={currentUserImage}
                      alt="user_img"
                      fill
                      className="rounded-full"
                    />
                  </Link>
                  <div className="thread-card_bar"></div>
                </div>
              </FormLabel>
              <FormControl className="no-focus border-none  bg-transparent text-light-1">
                <Input
                  type="text"
                  className=" no-focus"
                  placeholder="add a comment..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn ">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
