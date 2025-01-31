// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui-pro", "nuxt-edgedb-module", "@pinia/nuxt"],

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

  edgeDb: {
    devtools: true,
    dbschemaDir: "./shared/dbschema",
    queriesDir: "./server/queries",
    installCli: true,
    composables: true,
    auth: true,
    oauth: true,
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "always-multiline",
        braceStyle: "1tbs",
        indent: 2,
        quotes: "double",
        semi: false,
      },
    },
  },
})
