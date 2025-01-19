import AuthSeed from "../seeds/auth"
import type Seed from "../seeds/seed"
import SmtpSeed from "../seeds/smtp"

export default defineNitroPlugin(async () => {
  const onlyOnceSeeds: Seed[] = [
    new AuthSeed(),
  ]

  const alwaysSeeds: Seed[] = [
    new SmtpSeed(),
  ]

  const { checkSeed, createSeed } = useEdgeDbQueries()
  for (const seed of onlyOnceSeeds) {
    const exists = await checkSeed({ seed_name: seed.name })
    if (!exists) {
      await seed.seed()
      await createSeed({ seed_name: seed.name })
      console.log(`Seeded ${seed.name}`)
    }
  }

  for (const seed of alwaysSeeds) {
    await seed.seed()
    console.log(`Seeded ${seed.name}`)
  }
})
