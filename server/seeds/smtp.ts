import Seed from "./seed"

export default class SmtpSeed extends Seed {
  runtimeConfig = useRuntimeConfig()

  constructor() {
    super("smtp", {
      seed: async () => {
        await this.setSmtpConfig()
      },
      shouldRunSeed: async () => true,
      afterRunSeed: async () => {},
    })
  }

  async setSmtpConfig() {
    console.log("Hello")
    await this.client.query(`
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
  `)
    console.log("Hello2")
  }
}
