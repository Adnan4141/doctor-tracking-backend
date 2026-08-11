import { prisma } from '../../prisma/client';

export class DashboardService {
  static async getStats() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [totalDoctors, totalPatients, newPatientsThisWeek, specializationsGroup] = await Promise.all([
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.patient.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.doctor.groupBy({
        by: ['specialization'],
      }),
    ]);

    // Fetch all doctors with their patient counts
    const doctors = await prisma.doctor.findMany({
      select: { id: true, name: true, specialization: true },
      orderBy: { createdAt: 'asc' },
    });

    const patientCountsByDoctor = await prisma.patient.groupBy({
      by: ['doctorId'],
      _count: { id: true },
    });

    const countMap = new Map(patientCountsByDoctor.map((item) => [item.doctorId, item._count.id]));

    const patientsPerDoctor = doctors.map((doc) => ({
      doctorId: doc.id,
      doctorName: doc.name,
      specialization: doc.specialization,
      patientCount: countMap.get(doc.id) || 0,
    }));

    // Date-based 30-day trend
    const recentPatients = await prisma.patient.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dateMap = new Map<string, number>();
    for (let i = 0; i <= 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const formatted = d.toISOString().split('T')[0];
      dateMap.set(formatted, 0);
    }

    recentPatients.forEach((patient) => {
      const dateKey = patient.createdAt.toISOString().split('T')[0];
      if (dateMap.has(dateKey)) {
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
      }
    });

    const dateTrend = Array.from(dateMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    const avgPatientsPerDoctor = totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : '0';

    return {
      totals: {
        totalDoctors,
        totalPatients,
        newPatientsThisWeek,
        totalSpecializations: specializationsGroup.length,
        avgPatientsPerDoctor,
      },
      patientsPerDoctor,
      dateTrend,
    };
  }
}
