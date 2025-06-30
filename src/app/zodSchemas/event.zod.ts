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

export const updateEventZodSchema = z.object({
  eventTitle: z
    .string({
      required_error: "Event title is required",
    })
    .min(3, "Title must be at least 3 characters").optional(),

  dateAndTime: z
    .string({
      required_error: "Date and time is required",
    })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date and time format",
    }).optional(),

  location: z
    .string({
      required_error: "Location is required",
    })
    .min(2, "Location must be at least 2 characters").optional(),

  description: z
    .string({
      required_error: "Description is required",
    })
    .min(10, "Description must be at least 10 characters").optional(),

  attendeeCount: z
    .number({
      required_error: "Attendee count is required",
      invalid_type_error: "Attendee count must be a number",
    })
    .int()
    .nonnegative("Attendee count cannot be negative").optional(),
});
