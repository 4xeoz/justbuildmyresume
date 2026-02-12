import { z } from "zod"

export const userProfileSchema = z.object({
  phone: z.string().optional(),
  location: z.string().min(2, "Location is required").max(200),
  headline: z.string().min(10, "Headline must be at least 10 characters").max(500),
  summary: z.string().min(50, "Summary must be at least 50 characters").max(2000),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export const experienceSchema = z.object({
  type: z.enum(["JOB", "PROJECT", "VOLUNTEER", "EDUCATION"]),
  title: z.string().min(2, "Title is required").max(200),
  organization: z.string().min(2, "Organization is required").max(200),
  location: z.string().max(200).optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrentRole: z.boolean().default(false),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  skills: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
})

export const highlightSchema = z.object({
  content: z.string().min(30, "Highlight must be at least 30 characters").max(1000),
  skills: z.array(z.string()).default([]),
  metrics: z.array(z.string()).default([]),
})

export type UserProfileInput = z.infer<typeof userProfileSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>
export type HighlightInput = z.infer<typeof highlightSchema>
