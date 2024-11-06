import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const records = sqliteTable("records", {
  id: integer("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  phone: text("phone"),
  sex: text("sex"),
  name: text("name"),
  city: text("city"),
  question: text("question"),
  results: text("results"),
  description: text("description"),
  last_modified: text("last_modified"),
  day_pasted: integer("day_pasted"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});