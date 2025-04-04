import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./shared/dbschema/default.gel",
  dialect: "gel",
  out: "./migrations",
})
