import type { H3Event } from "h3"
import { Effect } from "effect"

export function getPageQuery(req: H3Event): Effect.Effect<ConfigurablePageMetadata> {
  return Effect.sync(() => {
    const query = getQuery(req)
    const page = parseInt(query.page as string) || 1
    const per = parseInt(query.per as string) || 12
    return { page, per }
  })
}
