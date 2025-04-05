// import { Effect } from "effect"
// import Seed from "./seed"
// import { createLanguage } from "~~/shared/dbschema/queries"

// export default class LanguageSeed extends Seed {
//   constructor() {
//     super("language")
//   }

//   createLanguage(name: string, code: string, nativeName: string): Effect.Effect<void, Error> {
//     return Effect.tryPromise(() => {
//       return createLanguage(this.client, { name, code, native_name: nativeName })
//     })
//   }

//   seed(): Effect.Effect<void, Error> {
//     return Effect.all([
//       this.createLanguage("English", "en", "English"),
//       this.createLanguage("German", "de", "Deutsch"),
//       this.createLanguage("French", "fr", "Français"),
//     ])
//   }
// }
