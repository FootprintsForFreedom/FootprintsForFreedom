// import { eq } from "drizzle-orm"
// import { Effect } from "effect"

// export class LegalDocumentRepository extends Effect.Service<LegalDocumentRepository>()(
//   "app/repositories/LegalDocumentRepository",
//   {
//     effect: Effect.gen(function* () {
//       const drizzle = yield* Drizzle

//       const createLegalDocument = (document: {
//         title: string
//         content: string
//         slug: string
//       }): Effect.Effect<void, SqlError> =>
//         drizzle.runQuery(
//           drizzle.client.insert(tables.legalDocument).values({ slug: document.slug }),
//         ).pipe(Effect.map(() => undefined))

//       const createLegalDocumentContent = (translation: {
//         title: string
//         content: string
//       }): Effect.Effect<void, SqlError> =>
//         drizzle.runQuery(
//           drizzle.client.insert(tables.legalDocumentContent).values({
//             title: translation.title,
//             content: translation.content,
//             languageCode: "en",
//           }),
//         ).pipe(Effect.map(() => undefined))
//     }),
//   },
// ) { }
