import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users, records } from "./schema";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);

// Initialize database with tables
const initDb = () => {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      phone TEXT,
      sex TEXT,
      name TEXT,
      city TEXT,
      question TEXT,
      results TEXT,
      description TEXT,
      last_modified TEXT,
      day_pasted INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Insert admin user if not exists
    INSERT OR IGNORE INTO users (id, username, password) VALUES (0, 'admin', 'admin123');
  `);
};

initDb();