import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';

/**
 * Middleware to ensure database connection is active
 * Handles reconnection if the connection is lost
 */
export const ensureDbConnection = async (
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Test the database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    next();
  } catch (error: any) {
    console.error('Database connection lost, attempting to reconnect...');

    try {
      // Disconnect and reconnect
      await prisma.$disconnect();
      await prisma.$connect();

      console.log('✅ Database reconnected successfully');
      next();
    } catch (reconnectError) {
      console.error('❌ Failed to reconnect to database:', reconnectError);
      next(error); // Pass the error to error handler
    }
  }
};
