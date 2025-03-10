import { z } from "zod";

export const TimeTableSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.coerce
    .number()
    .min(1, "Year must be at least 1")
    .max(4, "Year cannot exceed 4"),
  branch: z.string().min(2, "Branch must be at least 2 characters"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"), // added later
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"), // added later
  exams: z.array(
    z.object({
      id: z.string().optional(),
      timetableId: z.string().optional(),
      subject: z.string().min(1, "Subject is required"),
      code: z.string().optional(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
      timeSlot: z.enum(["10:00-13:00", "14:00-17:00"]),
      duration: z.coerce.number().nullable().optional(),
      venue: z.string().nullable().optional(),
    })
  ),
});
