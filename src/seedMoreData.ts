import { prisma } from './prisma/client';

async function fixDoctorNames() {
  try {
    await prisma.$connect();
    const doctors = await prisma.doctor.findMany();
    for (const doc of doctors) {
      if (doc.name.startsWith('Dr. Dr.')) {
        const cleanName = doc.name.replace(/^Dr\.\s*Dr\.\s*/, 'Dr. ');
        await prisma.doctor.update({
          where: { id: doc.id },
          data: { name: cleanName },
        });
        console.log(`🔧 Cleaned doctor name: ${doc.name} -> ${cleanName}`);
      }
    }
    console.log('✅ Doctor names cleaned up successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDoctorNames();
