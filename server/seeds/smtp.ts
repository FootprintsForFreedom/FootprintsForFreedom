import { Effect } from "effect"
import Seed from "./seed"

export default class SmtpSeed extends Seed {
  constructor() {
    super("smtp")
  }

  setSmtpConfig(): Effect.Effect<void> {
    return Effect.promise(() => this.client.query(`
    CONFIGURE CURRENT BRANCH SET
    ext::auth::SMTPConfig::sender := '${this.runtimeConfig.smtpSender}';

    CONFIGURE CURRENT BRANCH SET
    ext::auth::SMTPConfig::host := '${this.runtimeConfig.smtpHost}';

    CONFIGURE CURRENT BRANCH SET
    ext::auth::SMTPConfig::port := <int32>${this.runtimeConfig.smtpPort};

    CONFIGURE CURRENT BRANCH SET
    ext::auth::SMTPConfig::security := '${this.runtimeConfig.smtpSecurity}';

    CONFIGURE CURRENT BRANCH SET
    ext::auth::SMTPConfig::validate_certs := ${this.runtimeConfig.smtpValidateCerts};
  `))
  }

  shouldRunSeed(): Effect.Effect<boolean, Error> {
    return Effect.succeed(true)
  }

  seed(): Effect.Effect<void, Error> {
    return this.setSmtpConfig()
  }

  afterRunSeed(): Effect.Effect<void, Error> {
    return Effect.succeed(undefined)
  }
}
