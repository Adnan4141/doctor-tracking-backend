import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@doctortracker.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@doctortracker.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created/verified:', admin.email);

  // 2. Doctors Data
  const doctorsData = [
    {
      id: '6a7ae050232158d7d0465c76',
      name: 'Asem Rashed',
      specialization: 'Cardiology',
      hospital: 'Dhaka Medical College Hospital',
      phone: '01711223344',
      email: 'asemrashed@gmail.com',
    },
    {
      id: '6a7ae60e232158d7d0465c78',
      name: 'Safiqual Saurov',
      specialization: 'Neurology',
      hospital: 'Square Hospital Dhaka',
      phone: '01822334455',
      email: 'shafiqualsaurov@gmail.com',
    },
    {
      id: '6a7ae7bde084816e3c329ab5',
      name: 'Dr. Tanvir Hossain',
      specialization: 'Internal Medicine',
      hospital: 'Square Hospital Dhaka',
      phone: '01712345678',
      email: 'tanvir.hossain@example.org',
    },
    {
      id: '6a7ae7bde084816e3c329ab6',
      name: 'Dr. Nusrat Jahan',
      specialization: 'Dermatology',
      hospital: 'Evercare Hospital Dhaka',
      phone: '01823456789',
      email: 'nusrat.jahan@example.org',
    },
    {
      id: '6a7ae7bde084816e3c329ab7',
      name: 'Dr. Rafiqul Islam',
      specialization: 'Orthopedics',
      hospital: 'United Hospital Dhaka',
      phone: '01934567890',
      email: 'rafiqul.islam@example.org',
    },
    {
      id: '6a7ae7bee084816e3c329ab8',
      name: 'Dr. Sharmin Akter',
      specialization: 'Pediatrics',
      hospital: 'Labaid Specialized Hospital',
      phone: '01545678901',
      email: 'sharmin.akter@example.org',
    },
    {
      id: '6a7ae7bee084816e3c329ab9',
      name: 'Dr. Mahbubur Rahman',
      specialization: 'Nephrology',
      hospital: 'BIRDEM General Hospital',
      phone: '01656789012',
      email: 'mahbub.rahman@example.org',
    },
    {
      id: '6a7ae7bee084816e3c329aba',
      name: 'Dr. Farhana Islam',
      specialization: 'Gastroenterology',
      hospital: 'Ibn Sina Hospital',
      phone: '01767890123',
      email: 'farhana.islam@example.org',
    },
    {
      id: '6a7ae7bee084816e3c329abb',
      name: 'Dr. Kamrul Hasan',
      specialization: 'Endocrinology',
      hospital: 'Popular Diagnostic Centre',
      phone: '01878901234',
      email: 'kamrul.hasan@example.org',
    },
    {
      id: '6a7ae7bee084816e3c329abc',
      name: 'Dr. Sabina Yasmin',
      specialization: 'ENT (Otolaryngology)',
      hospital: 'Asgar Ali Hospital',
      phone: '01989012345',
      email: 'sabina.yasmin@example.org',
    },
    {
      id: '6a7ae7bfe084816e3c329abd',
      name: 'Dr. Anisur Rahman',
      specialization: 'Pulmonology',
      hospital: 'Chest Disease Hospital',
      phone: '01590123456',
      email: 'anis.rahman@example.org',
    },
    {
      id: '6a7ae7bfe084816e3c329abe',
      name: 'Dr. Sultana Parveen',
      specialization: 'Psychiatry',
      hospital: 'National Institute of Mental Health',
      phone: '01601234567',
      email: 'sultana.parveen@example.org',
    },
  ];

  for (const doc of doctorsData) {
    const existing = await prisma.doctor.findFirst({
      where: { OR: [{ id: doc.id }, { email: doc.email }] },
    });
    if (existing) {
      const { id, email, ...rest } = doc;
      await prisma.doctor.update({ where: { id: existing.id }, data: rest });
    } else {
      await prisma.doctor.create({ data: doc });
    }
  }
  console.log(`✅ ${doctorsData.length} Doctors seeded/verified.`);

  // 3. Patients Data
  const patientsData = [
    {
      id: '6a7ae89cec70d34282948b23',
      name: 'Kazi Mohammad Ali',
      age: 52,
      gender: 'Male',
      condition: 'Hypertension & Angina',
      contact: '01711223344',
      doctorId: '6a7ae050232158d7d0465c76',
      createdAt: new Date('2026-07-28T09:12:16.424Z'),
    },
    {
      id: '6a7ae89cec70d34282948b24',
      name: 'Nusrat Jahan Rahat',
      age: 34,
      gender: 'Female',
      condition: 'Migraine Aura',
      contact: '01822334455',
      doctorId: '6a7ae60e232158d7d0465c78',
      createdAt: new Date('2026-08-04T10:45:16.424Z'),
    },
    {
      id: '6a7ae89cec70d34282948b25',
      name: 'Mahmudul Hasan Sohel',
      age: 46,
      gender: 'Male',
      condition: 'Type 2 Diabetes',
      contact: '01933445566',
      doctorId: '6a7ae7bde084816e3c329ab5',
      createdAt: new Date('2026-07-16T08:16:16.424Z'),
    },
    {
      id: '6a7ae89dec70d34282948b26',
      name: 'Anika Tabassum',
      age: 29,
      gender: 'Female',
      condition: 'Atopic Dermatitis',
      contact: '01644556677',
      doctorId: '6a7ae7bde084816e3c329ab6',
      createdAt: new Date('2026-08-10T09:01:16.424Z'),
    },
    {
      id: '6a7ae89dec70d34282948b27',
      name: 'Tariqul Islam Rana',
      age: 53,
      gender: 'Male',
      condition: 'Lumbar Spondylosis',
      contact: '01755667788',
      doctorId: '6a7ae7bde084816e3c329ab7',
      createdAt: new Date('2026-08-02T09:33:16.424Z'),
    },
    {
      id: '6a7ae89dec70d34282948b28',
      name: 'Fariha Chowdhury Esha',
      age: 31,
      gender: 'Female',
      condition: 'Asthmatic Bronchitis',
      contact: '01866778899',
      doctorId: '6a7ae7bee084816e3c329ab8',
      createdAt: new Date('2026-08-10T02:23:16.424Z'),
    },
    {
      id: '6a7ae89dec70d34282948b29',
      name: 'Zubeir Ahmed Rizvi',
      age: 62,
      gender: 'Male',
      condition: 'Chronic Kidney Disease',
      contact: '01977889900',
      doctorId: '6a7ae7bee084816e3c329ab9',
      createdAt: new Date('2026-07-18T11:48:16.424Z'),
    },
    {
      id: '6a7ae89eec70d34282948b2a',
      name: 'Kazi Imran Nazir',
      age: 41,
      gender: 'Male',
      condition: 'Gastroesophageal Reflux',
      contact: '01588990011',
      doctorId: '6a7ae7bee084816e3c329aba',
      createdAt: new Date('2026-08-03T05:17:16.424Z'),
    },
    {
      id: '6a7ae89eec70d34282948b2b',
      name: 'Sabrina Yasmin Mitu',
      age: 37,
      gender: 'Female',
      condition: 'Thyroid Dysfunction',
      contact: '01699001122',
      doctorId: '6a7ae7bee084816e3c329abb',
      createdAt: new Date('2026-07-18T03:27:16.424Z'),
    },
    {
      id: '6a7ae89eec70d34282948b2c',
      name: 'Arman Hossain Bappy',
      age: 25,
      gender: 'Male',
      condition: 'Allergic Rhinitis',
      contact: '01700112233',
      doctorId: '6a7ae7bee084816e3c329abc',
      createdAt: new Date('2026-07-27T12:52:16.424Z'),
    },
    {
      id: '6a7ae89eec70d34282948b2d',
      name: 'Tahmina Begum Shanta',
      age: 48,
      gender: 'Female',
      condition: 'Rheumatoid Arthritis',
      contact: '01811223355',
      doctorId: '6a7ae7bfe084816e3c329abd',
      createdAt: new Date('2026-08-01T03:31:16.424Z'),
    },
    {
      id: '6a7ae89fec70d34282948b2e',
      name: 'Zubayer Rahman Chowdhury',
      age: 33,
      gender: 'Male',
      condition: 'Peptic Ulcer Disease',
      contact: '01922334466',
      doctorId: '6a7ae7bfe084816e3c329abe',
      createdAt: new Date('2026-08-10T07:14:16.424Z'),
    },
    {
      id: '6a7ae89fec70d34282948b2f',
      name: 'Kamrul Hasan Roni',
      age: 50,
      gender: 'Male',
      condition: 'Ischemic Heart Disease',
      contact: '01633445577',
      doctorId: '6a7ae050232158d7d0465c76',
      createdAt: new Date('2026-08-05T10:12:16.424Z'),
    },
    {
      id: '6a7ae89fec70d34282948b30',
      name: 'Farhana Akter Tanni',
      age: 26,
      gender: 'Female',
      condition: 'Polycystic Ovarian Syndrome',
      contact: '01744556688',
      doctorId: '6a7ae60e232158d7d0465c78',
      createdAt: new Date('2026-07-29T02:42:16.424Z'),
    },
    {
      id: '6a7ae89fec70d34282948b31',
      name: 'Shahadat Hossain',
      age: 58,
      gender: 'Male',
      condition: 'Osteoarthritis',
      contact: '01855667799',
      doctorId: '6a7ae7bde084816e3c329ab5',
      createdAt: new Date('2026-07-30T06:35:16.424Z'),
    },
    {
      id: '6a7ae89fec70d34282948b32',
      name: 'Rabiul Islam Babul',
      age: 44,
      gender: 'Male',
      condition: 'Hypercholesterolemia',
      contact: '01966778800',
      doctorId: '6a7ae7bde084816e3c329ab6',
      createdAt: new Date('2026-07-23T09:51:16.424Z'),
    },
    {
      id: '6a7ae8a0ec70d34282948b33',
      name: 'Ayesha Siddiqua',
      age: 36,
      gender: 'Female',
      condition: 'Iron Deficiency Anemia',
      contact: '01577889911',
      doctorId: '6a7ae7bde084816e3c329ab7',
      createdAt: new Date('2026-08-10T13:15:16.424Z'),
    },
    {
      id: '6a7ae8a0ec70d34282948b34',
      name: 'Mustafizur Rahman',
      age: 29,
      gender: 'Male',
      condition: 'Anxiety Neurosis',
      contact: '01688990022',
      doctorId: '6a7ae7bee084816e3c329ab8',
      createdAt: new Date('2026-07-19T09:56:16.424Z'),
    },
    {
      id: '6a7ae8a0ec70d34282948b35',
      name: 'Shamima Nasrin',
      age: 42,
      gender: 'Female',
      condition: 'Depressive Disorder',
      contact: '01799001133',
      doctorId: '6a7ae7bee084816e3c329ab9',
      createdAt: new Date('2026-07-26T02:02:16.424Z'),
    },
    {
      id: '6a7ae8a0ec70d34282948b36',
      name: 'Imtiaz Ahmed',
      age: 39,
      gender: 'Male',
      condition: 'Nephrolithiasis',
      contact: '01800112244',
      doctorId: '6a7ae7bee084816e3c329aba',
      createdAt: new Date('2026-08-01T06:00:16.424Z'),
    },
    {
      id: '6a7ae8a1ec70d34282948b37',
      name: 'Sultana Razia',
      age: 55,
      gender: 'Female',
      condition: 'Osteoporosis',
      contact: '01911223355',
      doctorId: '6a7ae7bee084816e3c329abb',
      createdAt: new Date('2026-08-06T05:39:16.424Z'),
    },
    {
      id: '6a7ae8a1ec70d34282948b38',
      name: 'Bipul Chandra Roy',
      age: 47,
      gender: 'Male',
      condition: 'Chronic Hepatitis B',
      contact: '01622334466',
      doctorId: '6a7ae7bee084816e3c329abc',
      createdAt: new Date('2026-07-15T04:26:16.424Z'),
    },
    {
      id: '6a7ae8a1ec70d34282948b39',
      name: 'Laila Arjumand',
      age: 35,
      gender: 'Female',
      condition: 'Systemic Lupus Erythematosus',
      contact: '01733445577',
      doctorId: '6a7ae7bfe084816e3c329abd',
      createdAt: new Date('2026-07-26T04:50:16.424Z'),
    },
    {
      id: '6a7ae8a1ec70d34282948b3a',
      name: 'Mehedi Hasan Munna',
      age: 28,
      gender: 'Male',
      condition: 'Epilepsy',
      contact: '01844556688',
      doctorId: '6a7ae7bfe084816e3c329abe',
      createdAt: new Date('2026-08-10T08:21:16.424Z'),
    },
    {
      id: '6a7ae8a1ec70d34282948b3b',
      name: 'Sharmin Sultana Lipi',
      age: 32,
      gender: 'Female',
      condition: 'Eczema Flare',
      contact: '01955667799',
      doctorId: '6a7ae050232158d7d0465c76',
      createdAt: new Date('2026-07-24T02:33:16.424Z'),
    },
  ];

  for (const patient of patientsData) {
    const existing = await prisma.patient.findUnique({ where: { id: patient.id } });
    if (existing) {
      const { id, ...rest } = patient;
      await prisma.patient.update({ where: { id: existing.id }, data: rest });
    } else {
      await prisma.patient.create({ data: patient });
    }
  }
  console.log(`✅ ${patientsData.length} Patient records seeded/verified.`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
