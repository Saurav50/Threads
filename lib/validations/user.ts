import * as z from "zod";
export const userValidation = z.object({
  profileImage: z.string().url(),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string().min(3).max(1000),
});
