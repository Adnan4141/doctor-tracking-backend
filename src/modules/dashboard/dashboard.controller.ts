import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { sendSuccess } from '../../utils/apiResponse';

export class DashboardController {
  static getStats = async (_req: Request, res: Response): Promise<void> => {
    const stats = await DashboardService.getStats();
    sendSuccess(res, 200, 'Dashboard stats retrieved successfully', stats);
  };
}
