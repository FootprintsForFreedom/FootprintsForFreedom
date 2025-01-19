import { randomBytes } from "crypto"
import { Effect, pipe } from "effect"
import Seed from "./seed"

export default class AuthSeed extends Seed {
  constructor() {
    super("auth")
  }

  generateSecureRandomKey(length: number): Effect.Effect<string> {
    return Effect.succeed(
      pipe(
        randomBytes(Math.ceil(length / 2)),
        buffer => buffer.toString("hex").slice(0, length),
      ),
    )
  }

  setSigningKey(): Effect.Effect<void> {
    return this.generateSecureRandomKey(64).pipe(
      Effect.flatMap(authSigningKey =>
        Effect.promise(() => {
          return this.client.query(`
          CONFIGURE CURRENT BRANCH SET
          ext::auth::AuthConfig::auth_signing_key := "${authSigningKey}";
          `)
        }),
      ))
  }

  enableEmailPasswordAuth(): Effect.Effect<void> {
    return Effect.promise(() => {
      return this.client.query(`
      CONFIGURE CURRENT BRANCH
      INSERT ext::auth::EmailPasswordProviderConfig {
          require_verification := true,
      };
      `)
    })
  }

  seed(): Effect.Effect<void, Error> {
    return Effect.all([
      this.setSigningKey(),
      this.enableEmailPasswordAuth(),
    ], { concurrency: "unbounded" })
  }
}
