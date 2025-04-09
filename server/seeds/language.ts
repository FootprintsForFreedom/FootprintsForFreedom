import { Effect } from "effect"
import { LanguageService } from "../services/language.service"
import type { CurrentUserService, HttpRequestHeaders } from "../services/current-user.service"
import Seed from "./seed"

export default class LanguageSeed extends Seed {
  constructor() {
    super("language")
  }

  createLanguage(name: string, code: string, nativeName: string): Effect.Effect<void, Error, LanguageService | CurrentUserService | HttpRequestHeaders> {
    const effect = Effect.gen(function* () {
      const languageService = yield* LanguageService
      const languageExists = yield* languageService.getLanguageByCode(code)
      if (!languageExists) {
        yield* languageService.createLanguage({
          name,
          code,
          native_name: nativeName,
        })
      }
    })
    return effect
  }

  seed(): Effect.Effect<void, Error, LanguageService | CurrentUserService | HttpRequestHeaders> {
    return Effect.all([
      this.createLanguage("English", "en", "English"),
      this.createLanguage("German", "de", "Deutsch"),
      this.createLanguage("French", "fr", "Français"),
    ])
  }
}
