import type {
  RouteMiddlewaresType,
  RouteHandlerContextType,
} from '../../interfaces/route.interface'
import type { RequestInterface } from '../../interfaces/request.interface'

const handlerMock = jest.fn(
  (route: RouteMiddlewaresType) => async (req: Request, ctx: RouteHandlerContextType) => {
    const request: RequestInterface = {
      locals: {},
      query: ctx.params,
    }
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) request.body = await req.json()
    return route(request)
  }
)

const RouteUtils = {
  handler: handlerMock,
}

export default RouteUtils
