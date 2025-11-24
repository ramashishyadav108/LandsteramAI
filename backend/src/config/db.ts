import { PrismaClient } from '@prisma/client';
import { DATABASE } from '../constants/index.js';
import { isDevelopment } from './env.js';

const prisma = new PrismaClient({
  log: isDevelopment
    ? [...DATABASE.LOG_LEVELS.DEVELOPMENT]
    : [...DATABASE.LOG_LEVELS.PRODUCTION],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Handle connection errors and reconnect
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error);
    // Retry connection after 5 seconds
    setTimeout(() => {
      prisma.$connect().catch((err) => {
        console.error('❌ Retry failed:', err);
      });
    }, 5000);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
