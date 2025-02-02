import { Effect } from "effect"
import type { H3Event } from "h3"

type EdgeDbQueries = ReturnType<typeof useEdgeDbQueries>
type QueryNames = keyof EdgeDbQueries

export function executeDatabaseQuery<
  T extends QueryNames,
>(
  req: H3Event,
  queryName: T,
  ...arg: Parameters<EdgeDbQueries[T]>
): Effect.Effect<Awaited<ReturnType<EdgeDbQueries[T]>>, Error> {
  const query = useEdgeDbQueries(req)[queryName] as (
    ...args: Parameters<EdgeDbQueries[T]>
  ) => Promise<Awaited<ReturnType<EdgeDbQueries[T]>>>

  return Effect.tryPromise({
    try: () => query(...arg),
    catch: rethrowDatabaseError,
  }).pipe(
    Effect.withSpan(`edgedb-query-${String(queryName)}`),
  )
}
