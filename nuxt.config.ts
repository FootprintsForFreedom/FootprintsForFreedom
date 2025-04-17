// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui-pro",
    "@pinia/nuxt",
    "@nuxtjs/mdc",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  ui: {
    theme: {
      colors: ["primary", "secondary", "tertiary", "info", "success", "warning", "error"],
    },
  },

  runtimeConfig: {
    databaseUrl: "postgres://postgres:postgres@localhost:5432/postgres",
    passkey: {
      rpID: "localhost",
      rpName: "Footprints4Freedom",
      origin: "http://localhost:3000",
      userVerification: "required",
    },
    // TODO: move to smtp sub-object
    smtpSender: "noreply@test.test",
    smtpHost: "localhost",
    smtpPort: 1025,
    smtpSecurity: "STARTTLSOrPlainText",
    smtpValidateCerts: "true",
    allowedRedirectUrls: ["http://localhost:3000"],
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    "/": { prerender: true },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-07-11",

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "always-multiline",
        braceStyle: "1tbs",
        indent: 2,
        // TODO: remove following two lines or set to default
        quotes: "double",
        semi: false,
      },
    },
  },
})
