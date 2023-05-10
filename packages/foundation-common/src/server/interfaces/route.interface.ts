import type { RouteHandlerType } from '../types/route.type'

export interface RouteInterface {
  GET?: RouteHandlerType
  POST?: RouteHandlerType
  PATCH?: RouteHandlerType
  PUT?: RouteHandlerType
  DELETE?: RouteHandlerType
}
