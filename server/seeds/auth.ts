import { randomBytes } from "crypto"
import { createClient } from "edgedb"

const client = createClient()

function generateSecureRandomKey(length: number): string {
  const buffer = randomBytes(Math.ceil(length / 2))
  return buffer.toString("hex").slice(0, length)
}

async function setAppName() {
  await client.query(`
  CONFIGURE CURRENT BRANCH SET
  ext::auth::AuthConfig::app_name := "Footprints";
  `)
}

async function setSigningKey() {
  const authSigningKey = generateSecureRandomKey(64)
  await client.query(`
  CONFIGURE CURRENT BRANCH SET
  ext::auth::AuthConfig::auth_signing_key := "${authSigningKey}";
  `)
}

async function setAllowedRedirectUrls() {
  const allowedRedirectUrlsFromEnv = process.env.ALLOWED_REDIRECT_URLS
  if (!allowedRedirectUrlsFromEnv) {
    console.warn(
      "ALLOWED_REDIRECT_URLS environment variable is not set. Using defaults.",
    )
  }
  const allowedRedirectUrls = allowedRedirectUrlsFromEnv?.split(",") || [
    "http://localhost:3000",
  ]
  await client.query(`
  CONFIGURE CURRENT BRANCH SET
  ext::auth::AuthConfig::allowed_redirect_urls := {
      ${allowedRedirectUrls.map(url => `'${url}'`).join(",\n")}
  };
  `)
}

async function enableEmailPasswordAuth() {
  await client.query(`
  CONFIGURE CURRENT BRANCH
  INSERT ext::auth::EmailPasswordProviderConfig {
      require_verification := true,
  };
  `)
}

async function setSmtpConfig() {
  const smtpSender = process.env.SMTP_SENDER || "noreply@test.test"
  const smtpHost = process.env.SMTP_HOST || "localhost"
  const smtpPort = parseInt(process.env.SMTP_PORT || "1025", 10)
  const smtpSecurity = process.env.SMTP_SECURITY || "STARTTLSOrPlainText"
  const smtpValidateCerts = process.env.SMTP_VALIDATE_CERTS === "true"

  await client.query(`
  CONFIGURE CURRENT BRANCH SET
  ext::auth::SMTPConfig::sender := '${smtpSender}';

  CONFIGURE CURRENT BRANCH SET
  ext::auth::SMTPConfig::host := '${smtpHost}';

  CONFIGURE CURRENT BRANCH SET
  ext::auth::SMTPConfig::port := <int32>${smtpPort};

  CONFIGURE CURRENT BRANCH SET
  ext::auth::SMTPConfig::security := '${smtpSecurity}';

  CONFIGURE CURRENT BRANCH SET
  ext::auth::SMTPConfig::validate_certs := ${smtpValidateCerts};
  `)
}

export async function configureAuth() {
  await setAppName()
  await setSigningKey()
  await setAllowedRedirectUrls()
  await enableEmailPasswordAuth()
  await setSmtpConfig()
}
