// src/database/db.ts
import { drizzle, OPSQLiteDatabase } from 'drizzle-orm/op-sqlite';
import { type DB, open } from '@op-engineering/op-sqlite';

const DB_NAME = 'TeamPlayerDB';
const ENCRYPTION_KEY = 'your-secure-key-32-chars-long-here';

/**
 * Singleton class to manage the SQLite database connection and Drizzle ORM instance.
 */
export class Database {
  private static instance: Database | null = null;
  private dbInstance: DB | null = null;
  private drizzleInstance: OPSQLiteDatabase | null = null;

  // Private constructor to enforce singleton pattern
  private constructor() {}

  /**
   * Gets the singleton instance of the Database class, initializing it if necessary.
   * @returns {Promise<Database>} Singleton Database instance
   */
  public static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.initialize();
    }

    return Database.instance
  }

  public async close(): Promise<void> {
    if (this.dbInstance) {
      await this.dbInstance.close();
      this.dbInstance = null;
      this.drizzleInstance = null;
      console.log('Database connection closed');
    }
  }

  public async reset(): Promise<void> {
    if (!this.dbInstance) {
      throw new Error('Database instance not initialized');
    }

    // Drop all tables
    const tables = ['PersonalTasks', 'Availability', 'Projects', 'TeamMembers', 'Users', 'Processes', 'Milestones'];
    for (const table of tables) {
      await this.dbInstance.execute(`DROP TABLE IF EXISTS ${table}`);
    }

    // Close and reset the connection
    await this.close();
    Database.instance = null;

    console.log('Database reset completed');
  }

  /**
   * Gets the raw DB instance for migrations and direct SQL operations.
   * @returns {Promise<DB>} The DB instance
   */
  public async getDBInstance(): Promise<DB> {
    if (!this.dbInstance) {
      throw new Error('Database instance not initialized');
    }
    return this.dbInstance;
  }

  /**
   * Runs a migration function.
   * @param {Function} migrationFn - The migration function to run
   * @returns {Promise<void>}
   */
  public async runMigration(migrationFn: () => Promise<void>): Promise<void> {
    try {
      await migrationFn();
      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Initializes the SQLite database with encryption and creates tables.
   * @returns {Promise<void>}
   */
  private async initialize(): Promise<void> {
    if (!this.dbInstance) {
      this.dbInstance = await open({
        name: DB_NAME,
        encryptionKey: ENCRYPTION_KEY,
      });
      console.log('Database connection opened');
      await this.initTables();
    }
    if (!this.drizzleInstance) {
      this.drizzleInstance = drizzle(this.dbInstance);
      console.log('Drizzle instance created');
    }
  }

  /**
   * Initializes all tables in the database based on the schema definitions.
   * @returns {Promise<void>}
   */
  private async initTables(): Promise<void> {
    if (!this.dbInstance) {
      throw new Error('Database instance not initialized');
    }

    // Users table
    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        pin_hash TEXT NOT NULL,
        profile_name TEXT,
        recovery_answer TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        role TEXT DEFAULT 'Senior PM' CHECK (role IN ('Senior PM', 'Junior PM', 'Admin', 'Guest')),
        last_login TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        settings TEXT
      )
    `);

    // TeamMembers table
    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS TeamMembers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        status TEXT NOT NULL CHECK (status IN ('Free', 'Occupied')),
        group_ids TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Projects table
    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS Projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL CHECK (length(description) <= 500),
        start_date TEXT NOT NULL,
        deadline TEXT NOT NULL,
        priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
        assigned_members TEXT,
        group_ids TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // Availability table
    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS Availability (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        member_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('Free', 'Occupied', 'Partial')),
        time_slots TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (member_id) REFERENCES TeamMembers(id) ON DELETE CASCADE
      )
    `);

    // Milestones table
    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS Milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        start_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deadline TEXT NOT NULL,
        payment_date TEXT,
        payment_percentage REAL,
        weekly_meeting_day TEXT CHECK (weekly_meeting_day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
        description TEXT CHECK (length(description) <= 500),
        status TEXT DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Delayed')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE
      )
    `);

    // PersonalTasks table
    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS PersonalTasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        due_date TEXT NOT NULL,
        priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
        category TEXT,
        status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Completed', 'On Hold')),
        notes TEXT CHECK (length(notes) <= 1000),
        subtasks TEXT,
        assigned_to_id INTEGER,
        project_id INTEGER,
        milestone_id INTEGER,
        task_type TEXT NOT NULL CHECK (task_type IN ('Small', 'Medium', 'Large')),
        points INTEGER NOT NULL,
        process_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to_id) REFERENCES TeamMembers(id) ON DELETE SET NULL,
        FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE SET NULL,
        FOREIGN KEY (milestone_id) REFERENCES Milestones(id) ON DELETE SET NULL,
        FOREIGN KEY (process_id) REFERENCES Processes(id) ON DELETE SET NULL
      )
    `);

    // Processes table
    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS Processes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT CHECK (length(description) <= 500),
        project_ids TEXT,
        task_ids TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    console.log('All tables initialized');
  }

  public getDB(): OPSQLiteDatabase {
    if (!this.drizzleInstance) {
      throw new Error('Drizzle instance not initialized');
    }
    return this.drizzleInstance;
  }
}



export async function localDB() {
  const db = await Database.getInstance();
  return db.getDB()
}

export async function resetDB() {
  const db = await Database.getInstance();
  await db.reset();
}

export async function closeDB() {
  const db = await Database.getInstance();
  await db.close();
}

export async function getDB() {
  const db = await Database.getInstance();
  return db.getDBInstance();
}


// Export type for use in other modules
export type { OPSQLiteDatabase };