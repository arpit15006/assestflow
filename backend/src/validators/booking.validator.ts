import { z } from 'zod';

export const createBookingSchema = z.object({
  assetId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
}).refine((d) => new Date(d.startTime) < new Date(d.endTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const cancelBookingSchema = z.object({
  reason: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
