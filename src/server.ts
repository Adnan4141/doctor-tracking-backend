import app from './app';
import { ENV } from './config/env.config';
import { prisma } from './prisma/client';
import { AuthService } from './modules/auth/auth.service';

const PORT = parseInt(ENV.PORT, 10);

async function startServer() {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('✅ Connected to MongoDB via Prisma');

    // Auto-seed admin if no users exist
    await AuthService.seedAdminIfEmpty();

    app.listen(PORT, () => {
      console.log(`🚀 Doctor Tracker Backend listening on port ${PORT} [${ENV.NODE_ENV}]`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
