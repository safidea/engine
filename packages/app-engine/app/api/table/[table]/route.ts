import NextAppServer from '@providers/server/next.server.provider'

import type { ContextRouteType } from '@providers/server/next.server.provider'

export const GET = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
export const POST = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
