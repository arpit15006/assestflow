import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  assetId: z.string().uuid(),
  description: z.string().min(10, 'Please describe the issue in detail'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  photoUrl: z.string().url().optional(),
});

export const assignTechnicianSchema = z.object({
  technicianId: z.string().uuid('Invalid technician'),
});

export const resolveMaintenanceSchema = z.object({
  resolutionNotes: z.string().min(10, 'Please provide resolution notes'),
  cost: z.number().min(0).optional(),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
