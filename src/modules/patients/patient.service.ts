import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/apiResponse';
import { parsePaginationQuery, buildPaginationMeta, PaginationQuery } from '../../utils/pagination';
import { UpdatePatientInput } from './patient.schema';

export class PatientService {
  static async getAll(query: PaginationQuery) {
    const { page, limit, skip, search, dateFilter } = parsePaginationQuery(query);
    const condition = query.condition as string | undefined;

    const where: any = {
      ...(dateFilter?.createdAt && { createdAt: dateFilter.createdAt }),
      ...(condition && { condition: { contains: condition, mode: 'insensitive' } }),
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { condition: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { doctor: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          doctor: {
            select: { id: true, name: true, specialization: true, hospital: true },
          },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    return {
      patients,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  static async getById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        doctor: {
          select: { id: true, name: true, specialization: true, hospital: true },
        },
      },
    });

    if (!patient) {
      throw new ApiError(404, 'Patient not found');
    }

    return patient;
  }

  static async update(id: string, data: UpdatePatientInput) {
    await this.getById(id);
    if (data.doctorId) {
      const doctor = await prisma.doctor.findUnique({ where: { id: data.doctorId } });
      if (!doctor) {
        throw new ApiError(404, 'Assigned doctor not found');
      }
    }

    return prisma.patient.update({
      where: { id },
      data,
      include: {
        doctor: {
          select: { id: true, name: true, specialization: true },
        },
      },
    });
  }

  static async delete(id: string) {
    await this.getById(id);
    return prisma.patient.delete({ where: { id } });
  }
}
