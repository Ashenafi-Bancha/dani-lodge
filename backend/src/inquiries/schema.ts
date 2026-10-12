import { z } from 'zod';

/** Keep in sync with INTERESTS in frontend/src/lib/inquiry.ts */
export const INTERESTS = {
  stay: 'A stay at the lodge',
  meeting: 'The meeting hall',
  cafe: 'The café',
  event: 'A gathering or event',
  other: 'Something else',
} as const;

export type Interest = keyof typeof INTERESTS;

const blankToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);

const optionalDate = z.preprocess(
  blankToUndefined,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please use a valid date')
    .optional()
);

export const inquirySchema = z
  .object({
    name: z.string().trim().min(1, 'Please enter your name').max(120, 'Name is too long'),
    phone: z
      .string()
      .trim()
      .max(30, 'Please enter a valid phone number')
      .refine((v) => v.replace(/\D/g, '').length >= 9, 'Please enter a valid phone number'),
    interest: z.enum(Object.keys(INTERESTS) as [Interest, ...Interest[]], 'Please choose an option'),
    checkIn: optionalDate,
    checkOut: optionalDate,
    // The form sends guests as text
    guests: z.preprocess(
      (v) => (blankToUndefined(v) === undefined ? undefined : Number(v)),
      z.number('Please enter a number').int().min(1).max(500).optional()
    ),
    message: z
      .string()
      .trim()
      .min(1, 'Please tell us a little about your request')
      .max(2000, 'Message is too long'),
  })
  .refine((d) => !d.checkIn || !d.checkOut || d.checkOut >= d.checkIn, {
    path: ['checkOut'],
    message: 'Check-out cannot be before check-in',
  });

export type InquiryInput = z.infer<typeof inquirySchema>;

export const statusSchema = z.object({ status: z.enum(['new', 'handled']) });
export type InquiryStatus = z.infer<typeof statusSchema>['status'];

/** Flattens zod issues into { fieldName: firstMessage } for the form to display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form');
    errors[field] ??= issue.message;
  }
  return errors;
}
