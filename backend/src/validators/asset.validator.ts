import { z } from 'zod';

export const createAssetSchema = z.object({
  name: z.string().min(2, 'Asset name required'),
  serialNumber: z.string().min(2, 'Serial number required'),
  categoryId: z.string().uuid('Invalid category'),
  acquisitionDate: z.string().refine((d) => new Date(d) <= new Date(), 'Date cannot be in the future'),
  acquisitionCost: z.number().min(0),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']).default('NEW'),
  location: z.string().min(2, 'Location required'),
  departmentId: z.string().uuid().optional(),
  isShared: z.boolean().default(false),
});

export const updateAssetSchema = createAssetSchema.partial();

export const assetFiltersSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  search: z.string().optional(),
  status: z.enum(['AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED']).optional(),
  categoryId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
