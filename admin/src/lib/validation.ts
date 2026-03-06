// validation.ts

import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Registration Schema
export const registerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["admin", "user", "deliveryman"], {
    message: "Please select a valid role",
  }),
});

// User Schema
export const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(
    ["admin", "user", "deliveryman"],
    { message: "Please select a valid role" },
    // errorMap: () => ({ message: "Please select a valid role" }),
  ),
  avatar: z.string().optional(),
});

// User update Schema
export const userUpdateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "user", "deliveryman"]),
  avatar: z.string().optional(),
});

// Brand Schema
// export const brandSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//   // image: z.string().optional(),
//   image: z
//     .any()
//     .optional()
//     .refine(
//       (file) => !file || file instanceof File,
//       "Please upload a valid image file",
//     ),
// });

export const brandSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),

  image: z
    .custom<File | undefined>()
    .optional()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      {
        message: "Please upload a valid image file",
      },
    )
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "Image must be smaller than 2MB",
    }),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  categoryType: z.enum(["Featured", "Hot-Categories", "Top-Categories"], {
    message: "Please select a valid category type",
  }),
});

