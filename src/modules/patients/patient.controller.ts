import { Request, Response } from 'express';
import { PatientService } from './patient.service';
import { sendSuccess } from '../../utils/apiResponse';

export class PatientController {
  static getAll = async (req: Request, res: Response): Promise<void> => {
    const { patients, meta } = await PatientService.getAll(req.query);
    sendSuccess(res, 200, 'Patients retrieved successfully', patients, meta);
  };

  static getById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const patient = await PatientService.getById(id);
    sendSuccess(res, 200, 'Patient retrieved successfully', patient);
  };

  static update = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const patient = await PatientService.update(id, req.body);
    sendSuccess(res, 200, 'Patient updated successfully', patient);
  };

  static delete = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await PatientService.delete(id);
    sendSuccess(res, 200, 'Patient deleted successfully');
  };
}
