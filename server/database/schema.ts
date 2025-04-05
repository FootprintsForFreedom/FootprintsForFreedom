import { integer, pgTable, varchar, timestamp, unique } from "drizzle-orm/pg-core"

export const seedStatus = pgTable("seed_status", {
  seedName: varchar("seed_name").notNull().unique(),
  performedAt: timestamp("performed_at").notNull().defaultNow(),
  created: timestamp("created").notNull().defaultNow(),
  modified: timestamp("modified").notNull().defaultNow().$onUpdateFn(() => new Date()),
})
