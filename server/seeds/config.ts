import { Effect } from "effect"
import Seed from "./seed"

export default class ConfigSeed extends Seed {
  constructor() {
    super("config")
  }

  setAppName(): Effect.Effect<void, Error> {
    return Effect.tryPromise(() => {
      return this.client.query(`
        CONFIGURE CURRENT BRANCH SET
        ext::auth::AuthConfig::app_name := "Footprints";
        `)
    })
  }

  setAllowedRedirectUrls(): Effect.Effect<void, Error> {
    return Effect.tryPromise(() => {
      const allowedRedirectUrls = this.runtimeConfig.allowedRedirectUrls
      return this.client.query(`
        CONFIGURE CURRENT BRANCH SET
        ext::auth::AuthConfig::allowed_redirect_urls := {
            ${allowedRedirectUrls.map(url => `'${url}'`).join(",\n")}
        };
      `)
    })
  }

  shouldRunSeed(): Effect.Effect<boolean, Error> {
    return Effect.succeed(true)
  }

  seed(): Effect.Effect<void, Error> {
    return Effect.all([
      this.setAppName(),
      this.setAllowedRedirectUrls(),
    ], { concurrency: "unbounded" })
  }

  afterRunSeed(): Effect.Effect<void, Error> {
    return Effect.succeed(undefined)
  }
}
