import { RequestType } from './request.type'
import { ResponseType } from './response.type'

export type RouteHandlerContextType = {
  params: {
    [key: string]: string
  }
}

export type RouteHandlerType = (req: Request, opt: RouteHandlerContextType) => Promise<Response>

export type RouteMiddlewareType = (req: RequestType) => Promise<ResponseType | undefined>

export type RouteMiddlewaresType = (req: RequestType) => RouteMiddlewareType[]

export type RouteControllerType = (req: RequestType) => Promise<ResponseType>
