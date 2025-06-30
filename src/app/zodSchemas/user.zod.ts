import { z } from "zod";

export const userRegistrationZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  lastLoginTime: z.date().optional(),
  photoURL: z.string().url("Photo must be a valid URL").optional(),
});

export const userLoginZodSchema = z.object({
  email: z.string().email("Email is required").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  lastLoginTime: z.string(),
});
