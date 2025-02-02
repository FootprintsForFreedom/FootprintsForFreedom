import { Effect } from "effect"
import type { H3Event } from "h3"

type EdgeDbQueries = ReturnType<typeof useEdgeDbQueries>
type QueryNames = keyof EdgeDbQueries

export function executeDatabaseQuery<
  T extends QueryNames,
  P extends Parameters<EdgeDbQueries[T]>,
  R extends Awaited<ReturnType<EdgeDbQueries[T]>>,
  Query extends EdgeDbQueries[T] & ((arg: P) => Promise<R>),
>(
  req: H3Event,
  queryName: T,
  ...arg: P
): Effect.Effect<R, Error> {
  const query = useEdgeDbQueries(req)[queryName] as Query
  return Effect.tryPromise({
    try: () => query(arg),
    catch: rethrowDatabaseError,
  }).pipe(
    Effect.withSpan(`edgedb-query-${String(queryName)}`),
  )
}
