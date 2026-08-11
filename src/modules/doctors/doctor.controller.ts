import { Request, Response } from 'express';
import { DoctorService } from './doctor.service';
import { sendSuccess } from '../../utils/apiResponse';

export class DoctorController {
  static getAll = async (req: Request, res: Response): Promise<void> => {
    const { doctors, meta } = await DoctorService.getAll(req.query);
    sendSuccess(res, 200, 'Doctors retrieved successfully', doctors, meta);
  };

  static getSpecializations = async (_req: Request, res: Response): Promise<void> => {
    const specializations = await DoctorService.getSpecializations();
    sendSuccess(res, 200, 'Specializations retrieved successfully', specializations);
  };

  static updateSpecialization = async (req: Request, res: Response): Promise<void> => {
    const { oldName, newName } = req.body;
    const result = await DoctorService.updateSpecialization(oldName, newName);
    sendSuccess(res, 200, 'Specialization category updated successfully', result);
  };

  static deleteSpecialization = async (req: Request, res: Response): Promise<void> => {
    const name = (req.query.name as string) || (req.body.name as string);
    const result = await DoctorService.deleteSpecialization(name);
    sendSuccess(res, 200, 'Specialization category deleted successfully', result);
  };

  static getById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const doctor = await DoctorService.getById(id);
    sendSuccess(res, 200, 'Doctor retrieved successfully', doctor);
  };

  static create = async (req: Request, res: Response): Promise<void> => {
    const doctor = await DoctorService.create(req.body);
    sendSuccess(res, 201, 'Doctor created successfully', doctor);
  };

  static update = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const doctor = await DoctorService.update(id, req.body);
    sendSuccess(res, 200, 'Doctor updated successfully', doctor);
  };

  static delete = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await DoctorService.delete(id);
    sendSuccess(res, 200, 'Doctor deleted successfully');
  };

  static getPatients = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const patients = await DoctorService.getPatients(id);
    sendSuccess(res, 200, 'Doctor patients retrieved successfully', patients);
  };

  static addPatient = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const patient = await DoctorService.addPatient(id, req.body);
    sendSuccess(res, 201, 'Patient added to doctor successfully', patient);
  };

  static deletePatient = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const patientId = req.params.patientId as string;
    await DoctorService.deletePatient(id, patientId);
    sendSuccess(res, 200, 'Patient removed from doctor successfully');
  };
}
