import * as dotenv from "dotenv"
import { configureAuth } from "./auth"

async function seed() {
  await configureAuth()
}

const env = process.env.NODE_ENV || "development"
dotenv.config({ path: `.env.${env}` })

await seed()
