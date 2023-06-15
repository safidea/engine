import NextAppServer from '@app/server'

import type { ContextRouteType } from '@app/server'

export const GET = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
export const POST = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
