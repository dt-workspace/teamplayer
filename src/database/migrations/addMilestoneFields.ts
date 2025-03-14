import { Database } from '../db';

/**
 * Migration script to add new fields to the Milestones table:
 * - start_date
 * - payment_date
 * - payment_percentage
 * - weekly_meeting_day
 */
export async function migrateAddMilestoneFields(): Promise<void> {
  try {
    // Get database instance
    const db = await Database.getInstance();
    const dbInstance = await db.getDBInstance();
    
    if (!dbInstance) {
      throw new Error('Database instance not initialized');
    }
    
    console.log('Starting migration: Adding new fields to Milestones table');
    
    // Check if start_date column exists
    const tableInfo = await dbInstance.execute(`PRAGMA table_info(Milestones)`);
    const columns = tableInfo.rows as { name: string }[];
    const columnNames = columns.map(col => col.name);
    
    // Only add columns if they don't exist
    if (!columnNames.includes('start_date')) {
      console.log('Adding start_date column to Milestones table');
      await dbInstance.execute(`ALTER TABLE Milestones ADD COLUMN start_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }
    
    if (!columnNames.includes('payment_date')) {
      console.log('Adding payment_date column to Milestones table');
      await dbInstance.execute(`ALTER TABLE Milestones ADD COLUMN payment_date TEXT`);
    }
    
    if (!columnNames.includes('payment_percentage')) {
      console.log('Adding payment_percentage column to Milestones table');
      await dbInstance.execute(`ALTER TABLE Milestones ADD COLUMN payment_percentage REAL`);
    }
    
    if (!columnNames.includes('weekly_meeting_day')) {
      console.log('Adding weekly_meeting_day column to Milestones table');
      await dbInstance.execute(`ALTER TABLE Milestones ADD COLUMN weekly_meeting_day TEXT CHECK (weekly_meeting_day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))`);
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
} 