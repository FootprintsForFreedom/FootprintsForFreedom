import { getCookie } from "h3"
import type { EventHandlerRequest, H3Event } from "h3"
import { createClient, type Client } from "gel"
import * as queries from "~~/shared/dbschema/queries"

// Extend the NitroApp type to include _gelClient
declare module "nitropack" {
  interface NitroApp {
    _gelClient?: Client
  }
}

// TODO: use effect?
export function useGel(req: H3Event<EventHandlerRequest> | undefined = undefined) {
  const nitro = useNitroApp()
  if (!nitro._gelClient) {
    nitro._gelClient = createClient()
  }

  if (req) {
    return nitro._gelClient.withGlobals({
      "ext::auth::client_token": getCookie(req, "edgedb-auth-token"),
    })
  }

  return nitro._gelClient
}

export type EdgeDbQueries = keyof typeof queries

export function useGelQueries(
  req?: H3Event<EventHandlerRequest>,
): { [K in EdgeDbQueries]: (arg?: Parameters<typeof queries[K]>[1]) => ReturnType<typeof queries[K]> } {
  const client = useGel(req)

  return Object.fromEntries(
    Object.entries(queries).map(([key, fn]) => {
      return [
        key,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (args?: Parameters<typeof fn>[1]) => fn(client, args as any),
      ]
    }),
  ) as { [K in EdgeDbQueries]: (arg?: Parameters<typeof queries[K]>[1]) => ReturnType<typeof queries[K]> }
}
