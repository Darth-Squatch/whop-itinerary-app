import { z } from "zod";

export const createTripSchema = z.object({
  companyId: z.string().min(1),
  experienceId: z.string().min(1),
  title: z.string().min(1),
  destination: z.string().min(1),
  description: z.string().optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal(""))
});

export const updateTripSchema = z.object({
  title: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  description: z.string().optional(),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  days: z
    .array(
      z.object({
        id: z.string().optional(),
        dayNumber: z.number().int().positive(),
        title: z.string().min(1),
        date: z.string().optional().or(z.literal("")),
        summary: z.string().optional(),
        sortOrder: z.number().int().nonnegative(),
        items: z.array(
          z.object({
            id: z.string().optional(),
            timeLabel: z.string().optional(),
            title: z.string().min(1),
            type: z
              .enum([
                "HOTEL",
                "FLIGHT",
                "ACTIVITY",
                "RESTAURANT",
                "TRANSPORTATION",
                "RESERVATION",
                "NOTE",
                "CUSTOM"
              ])
              .default("CUSTOM"),
            location: z.string().optional(),
            notes: z.string().optional(),
            externalLink: z.string().url().optional().or(z.literal("")),
            sortOrder: z.number().int().nonnegative()
          })
        )
      })
    )
    .optional()
});
