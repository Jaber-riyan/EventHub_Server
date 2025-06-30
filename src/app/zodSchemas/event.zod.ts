import { z } from "zod";

export const createEventZodSchema = z.object({
    eventTitle: z.string().trim().min(1, "Event title is required"),
    name: z.string().trim().min(1, "Name is required"),
    dateAndTime: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    attendeeCount: z.number().optional().default(0),
});

export const joinEventZodSchema = z.object({
  user: z.string().min(1, "User ID is required"),
  event: z.string().min(1, "Event ID is required"),
});
