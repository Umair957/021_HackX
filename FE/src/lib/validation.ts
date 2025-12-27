// src/lib/validation.ts
import { z } from "zod";

// Helper to transform empty strings to undefined for optional fields
const optionalString = z.string().transform(val => val === "" ? undefined : val).optional();

// --- Personal Details ---
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"), 
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  headline: optionalString,
  phone: optionalString,
  summary: optionalString,
  urls: z.any().optional(),
  location: z.any().optional(),
});

// --- Work Experience ---
export const workExperienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: optionalString,
  description: optionalString,
  dates: z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: optionalString,
    isCurrent: z.boolean().optional(),
  }).refine((data) => {
    // If current job, end date is not required
    if (data.isCurrent) return true;
    // If not current, end date should exist
    if (!data.endDate) return false;
    // End date should not be before start date
    return new Date(data.endDate) >= new Date(data.startDate);
  }, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  }),
});

// --- Education ---
export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: optionalString,
  graduationYear: z.number()
    .min(1950, "Year seems too old")
    .max(new Date().getFullYear() + 10, "Year is too far in the future"),
  gpa: z.number().min(0).max(4.0, "GPA cannot exceed 4.0").optional(),
});