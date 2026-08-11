import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/apiResponse';
import { parsePaginationQuery, buildPaginationMeta, PaginationQuery } from '../../utils/pagination';
import { CreateDoctorInput, UpdateDoctorInput, AddDoctorPatientInput } from './doctor.schema';

export class DoctorService {
  static async getAll(query: PaginationQuery) {
    const { page, limit, skip, search, dateFilter } = parsePaginationQuery(query);
    const specialization = query.specialization as string | undefined;

    const where: any = {
      ...(dateFilter?.createdAt && { createdAt: dateFilter.createdAt }),
      ...(specialization && { specialization: { contains: specialization, mode: 'insensitive' } }),
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } },
        { hospital: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { patients: true } },
        },
      }),
      prisma.doctor.count({ where }),
    ]);

    return {
      doctors,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  static async getSpecializations() {
    const defaultSpecializations = [
      'Cardiology',
      'Neurology',
      'Pediatrics',
      'Orthopedics',
      'Dermatology',
      'General Surgery',
      'Internal Medicine',
      'Oncology',
      'Psychiatry',
      'Radiology',
    ];

    const grouped = await prisma.doctor.groupBy({
      by: ['specialization'],
      _count: { id: true },
    });

    const activeMap = new Map<string, number>();
    grouped.forEach((g) => {
      if (g.specialization) {
        activeMap.set(g.specialization, g._count.id);
      }
    });

    const allSet = new Set([...defaultSpecializations, ...activeMap.keys()]);

    return Array.from(allSet).map((name) => ({
      name,
      doctorCount: activeMap.get(name) || 0,
    }));
  }

  static async updateSpecialization(oldName: string, newName: string) {
    if (!oldName || !newName) {
      throw new ApiError(400, 'Old and new specialization names are required');
    }
    const updated = await prisma.doctor.updateMany({
      where: { specialization: { equals: oldName, mode: 'insensitive' } },
      data: { specialization: newName },
    });
    return { updatedCount: updated.count, oldName, newName };
  }

  static async deleteSpecialization(name: string) {
    if (!name) {
      throw new ApiError(400, 'Specialization name is required');
    }
    const updated = await prisma.doctor.updateMany({
      where: { specialization: { equals: name, mode: 'insensitive' } },
      data: { specialization: 'General Practice' },
    });
    return { reassignedCount: updated.count, deletedName: name };
  }

  static async getById(id: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        patients: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    return doctor;
  }

  static async create(data: CreateDoctorInput) {
    const existing = await prisma.doctor.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ApiError(400, 'Doctor with this email already exists');
    }
    return prisma.doctor.create({ data });
  }

  static async update(id: string, data: UpdateDoctorInput) {
    await this.getById(id);
    if (data.email) {
      const existing = await prisma.doctor.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existing) {
        throw new ApiError(400, 'Another doctor is using this email');
      }
    }
    return prisma.doctor.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    await this.getById(id);
    return prisma.$transaction([
      prisma.patient.deleteMany({ where: { doctorId: id } }),
      prisma.doctor.delete({ where: { id } }),
    ]);
  }

  static async getPatients(doctorId: string) {
    await this.getById(doctorId);
    return prisma.patient.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async addPatient(doctorId: string, data: AddDoctorPatientInput) {
    await this.getById(doctorId);
    return prisma.patient.create({
      data: {
        ...data,
        doctorId,
      },
    });
  }

  static async deletePatient(doctorId: string, patientId: string) {
    const patient = await prisma.patient.findFirst({
      where: { id: patientId, doctorId },
    });
    if (!patient) {
      throw new ApiError(404, 'Patient not found for this doctor');
    }
    return prisma.patient.delete({ where: { id: patientId } });
  }
}
