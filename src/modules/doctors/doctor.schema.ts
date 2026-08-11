import { z } from 'zod';

export const createDoctorSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    specialization: z.string().min(2, 'Specialization is required'),
    hospital: z.string().min(2, 'Hospital is required'),
    phone: z.string().min(5, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
  }),
});

export const updateDoctorSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Doctor ID is required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    specialization: z.string().min(2).optional(),
    hospital: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email().optional(),
  }),
});

export const doctorIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Doctor ID is required'),
  }),
});

export const addDoctorPatientSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Doctor ID is required'),
  }),
  body: z.object({
    name: z.string().min(2, 'Patient name is required'),
    age: z.number().int().positive('Age must be a positive integer'),
    gender: z.enum(['Male', 'Female', 'Other']),
    condition: z.string().min(2, 'Condition is required'),
    contact: z.string().min(5, 'Contact number is required'),
  }),
});

export const doctorPatientParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Doctor ID is required'),
    patientId: z.string().min(1, 'Patient ID is required'),
  }),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>['body'];
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>['body'];
export type AddDoctorPatientInput = z.infer<typeof addDoctorPatientSchema>['body'];
