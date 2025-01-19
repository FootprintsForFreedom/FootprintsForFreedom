import { randomBytes } from "crypto"
import Seed from "./seed"

export default class AuthSeed extends Seed {
  constructor() {
    super("auth", {
      seed: async () => {
        await this.seedAuth()
      },
      shouldRunSeed: async () => {
        return this.checkShouldSeed()
      },
      afterRunSeed: async () => {
        return this.storeSeed()
      },
    })
  }

  generateSecureRandomKey(length: number): string {
    const buffer = randomBytes(Math.ceil(length / 2))
    return buffer.toString("hex").slice(0, length)
  }

  async setAppName() {
    await this.client.query(`
    CONFIGURE CURRENT BRANCH SET
    ext::auth::AuthConfig::app_name := "Footprints";
    `)
  }

  async setSigningKey() {
    const authSigningKey = this.generateSecureRandomKey(64)
    await this.client.query(`
    CONFIGURE CURRENT BRANCH SET
    ext::auth::AuthConfig::auth_signing_key := "${authSigningKey}";
    `)
  }

  async setAllowedRedirectUrls() {
    const allowedRedirectUrlsFromEnv = process.env.ALLOWED_REDIRECT_URLS
    if (!allowedRedirectUrlsFromEnv) {
      console.warn(
        "ALLOWED_REDIRECT_URLS environment variable is not set. Using defaults.",
      )
    }
    const allowedRedirectUrls = allowedRedirectUrlsFromEnv?.split(",") || [
      "http://localhost:3000",
    ]
    await this.client.query(`
    CONFIGURE CURRENT BRANCH SET
    ext::auth::AuthConfig::allowed_redirect_urls := {
        ${allowedRedirectUrls.map(url => `'${url}'`).join(",\n")}
    };
    `)
  }

  async enableEmailPasswordAuth() {
    await this.client.query(`
    CONFIGURE CURRENT BRANCH
    INSERT ext::auth::EmailPasswordProviderConfig {
        require_verification := true,
    };
    `)
  }

  async checkShouldSeed() {
    const { checkSeed } = useEdgeDbQueries()
    const exists = await checkSeed({ seed_name: this.name })
    return !exists
  }

  async storeSeed() {
    const { createSeed } = useEdgeDbQueries()
    await createSeed({ seed_name: this.name })
  }

  async seedAuth() {
    await this.setAppName()
    await this.setSigningKey()
    await this.setAllowedRedirectUrls()
    await this.enableEmailPasswordAuth()
  }
}
