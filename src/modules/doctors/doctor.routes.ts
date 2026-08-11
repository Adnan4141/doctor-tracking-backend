import { Router } from 'express';
import { DoctorController } from './doctor.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createDoctorSchema,
  updateDoctorSchema,
  doctorIdParamSchema,
  addDoctorPatientSchema,
  doctorPatientParamsSchema,
} from './doctor.schema';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(DoctorController.getAll));
router.get('/specializations', asyncHandler(DoctorController.getSpecializations));
router.post('/', validate(createDoctorSchema), asyncHandler(DoctorController.create));
router.get('/:id', validate(doctorIdParamSchema), asyncHandler(DoctorController.getById));
router.put('/:id', validate(updateDoctorSchema), asyncHandler(DoctorController.update));
router.delete('/:id', validate(doctorIdParamSchema), asyncHandler(DoctorController.delete));

// Nested patient routes
router.get('/:id/patients', validate(doctorIdParamSchema), asyncHandler(DoctorController.getPatients));
router.post('/:id/patients', validate(addDoctorPatientSchema), asyncHandler(DoctorController.addPatient));
router.delete('/:id/patients/:patientId', validate(doctorPatientParamsSchema), asyncHandler(DoctorController.deletePatient));

export default router;
