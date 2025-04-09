// import { Effect } from "effect"
// import Seed from "./seed"

// export default class LegalSeed extends Seed {
//   constructor() {
//     super("legal")
//   }

//   createLegalDocument(title: string, content: string): Effect.Effect<void, Error> {
//     const slug = slugify(title)
//     return Effect.tryPromise(() => {
//       return createLegalDocument(this.client, { title, slug })
//     }).pipe(
//       Effect.flatMap(legalDocumentId =>
//         Effect.tryPromise(() => {
//           return createLegalDocumentTranslation(this.client, { title, slug, documentId: legalDocumentId.id, content, languageCode: "en" })
//         }),
//       ),
//     )
//   }

//   seed(): Effect.Effect<void, Error> {
//     return Effect.all([
//       this.createLegalDocument("Terms of Service", "This is the terms of service"),
//       this.createLegalDocument("Privacy Policy", "This is the privacy policy"),
//       this.createLegalDocument("Imprint", "This is the imprint"),
//     ], { concurrency: "unbounded" })
//   }
// }
