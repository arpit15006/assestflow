import { z } from 'zod';

export const createAllocationSchema = z.object({
  assetId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  expectedReturnDate: z.string().datetime().optional(),
  notes: z.string().optional(),
}).refine((d) => d.userId || d.departmentId, {
  message: 'Either userId or departmentId must be provided',
});

export const returnAssetSchema = z.object({
  returnCondition: z.enum(['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']),
  notes: z.string().optional(),
});

export type CreateAllocationInput = z.infer<typeof createAllocationSchema>;
