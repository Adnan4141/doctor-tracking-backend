import { Router } from 'express';
import { PatientController } from './patient.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { updatePatientSchema, patientIdParamSchema } from './patient.schema';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(PatientController.getAll));
router.get('/:id', validate(patientIdParamSchema), asyncHandler(PatientController.getById));
router.put('/:id', validate(updatePatientSchema), asyncHandler(PatientController.update));
router.delete('/:id', validate(patientIdParamSchema), asyncHandler(PatientController.delete));

export default router;
