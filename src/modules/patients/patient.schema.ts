import { z } from 'zod';

export const updatePatientSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Patient ID is required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    age: z.number().int().positive().optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    condition: z.string().min(2).optional(),
    contact: z.string().min(5).optional(),
    doctorId: z.string().optional(),
  }),
});

export const patientIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Patient ID is required'),
  }),
});

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>['body'];
