import NextAppServer from '@app/server'

import type { ContextRouteType } from '@app/server'

export const GET = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
export const PATCH = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
export const PUT = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
export const DELETE = async (request: Request, context: ContextRouteType) =>
  NextAppServer.route(request, context)
