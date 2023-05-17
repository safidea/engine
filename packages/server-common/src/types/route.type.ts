import { RequestInterface } from '../interfaces/request.interface'
import { ResponseInterface } from '../interfaces/response.interface'

export type RouteHandlerContextType = {
  params: {
    [key: string]: string
  }
}

export type RouteHandlerType = (req: Request, opt: RouteHandlerContextType) => Promise<Response>

export type RouteMiddlewareType = (req: RequestInterface) => Promise<ResponseInterface | undefined>

export type RouteMiddlewaresType = (req: RequestInterface) => RouteMiddlewareType[]

export type RouteControllerType = (req: RequestInterface) => Promise<ResponseInterface>
