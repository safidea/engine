import NextLib from '../lib/next.lib'
import { RequestType } from '../types/request.type'
import { ResponseType } from '../types/response.type'
import type {
  RouteMiddlewaresType,
  RouteMiddlewareType,
  RouteHandlerType,
  RouteHandlerContextType,
} from '../types/route.type'

class RouteUtils {
  public handler(route: RouteMiddlewaresType): RouteHandlerType {
    return async function (req: Request, ctx: RouteHandlerContextType) {
      const request: RequestType = {
        locals: {},
        query: ctx.params,
        body: req.json(),
      }
      const middlewares: RouteMiddlewareType[] = route(request)

      async function nextMiddleware(): Promise<ResponseType> {
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
