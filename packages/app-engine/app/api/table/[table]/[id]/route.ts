import NextAppServer from '@providers/server/next.server.provider'

import type { ContextRouteType } from '@providers/server/next.server.provider'

export const GET = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
export const PATCH = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
export const PUT = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
export const DELETE = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
