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

    // Aggregate patients count per doctor
    const patientCountsByDoctor = await prisma.patient.groupBy({
      by: ['doctorId'],
      _count: { id: true },
    });

    const doctorIds = patientCountsByDoctor.map((item) => item.doctorId);
    const doctors = await prisma.doctor.findMany({
      where: { id: { in: doctorIds } },
      select: { id: true, name: true, specialization: true },
    });

    const doctorMap = new Map(doctors.map((doc) => [doc.id, doc]));

    const patientsPerDoctor = patientCountsByDoctor.map((item) => {
      const doc = doctorMap.get(item.doctorId);
      return {
        doctorId: item.doctorId,
        doctorName: doc ? doc.name : 'Unknown Doctor',
        specialization: doc ? doc.specialization : 'General',
        patientCount: item._count.id,
      };
    });

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
