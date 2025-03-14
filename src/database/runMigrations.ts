import { Database } from './db';
import { migrateAddMilestoneFields } from './migrations/addMilestoneFields';

/**
 * Runs all migrations in sequence.
 */
export async function runAllMigrations(): Promise<void> {
  try {
    console.log('Starting database migrations...');
    const db = await Database.getInstance();
    
    // Run migrations in sequence
    await db.runMigration(migrateAddMilestoneFields);
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runAllMigrations()
    .then(() => {
      console.log('Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
} 