import z from "zod";


// Zod schema for subject form validation
export const subjectSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, { message: "Subject name must be 3 characters long" }),
});

// TypeScript type inferred from the Zod schema
export type SubjectSchema = z.infer<typeof subjectSchema>;
