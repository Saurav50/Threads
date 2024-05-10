import * as z from "zod";
export const threadValidation = z.object({
  thread: z.string().min(3, { message: "Minimum length must be 3 characters" }),
  accountId: z.string().min(1),
});

export const commentValidation = z.object({
  thread: z.string().min(1, { message: "Minimum length must be 1 characters" }),
});
