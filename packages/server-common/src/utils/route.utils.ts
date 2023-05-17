import NextLib from '../libraries/next.library'
import { RequestInterface } from '../interfaces/request.interface'
import { ResponseInterface } from '../interfaces/response.interface'
import type {
  RouteMiddlewaresType,
  RouteMiddlewareType,
  RouteHandlerType,
  RouteHandlerContextType,
} from '../types/route.type'

class RouteUtils {
  public handler(route: RouteMiddlewaresType): RouteHandlerType {
    return async function (req: Request, ctx: RouteHandlerContextType) {
      const request: RequestInterface = {
        locals: {},
        query: ctx.params,
      }
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        request.body = await req.json()
      }
      const middlewares: RouteMiddlewareType[] = route(request)

      async function nextMiddleware(): Promise<ResponseInterface> {
        const currentMiddleware = middlewares.shift()
        if (currentMiddleware) {
          let res = await currentMiddleware(request)
          if (!res) res = { status: 200, json: {} }
          else if (!res.status) res.status = 200
          if (middlewares.length > 0 && res.status === 200) return nextMiddleware()
          return res
        }
        return { status: 200, json: {} }
      }

      const { json, status } = await nextMiddleware()
      return NextLib.Response.json(json, { status })
    }
  }
}

export default new RouteUtils()
