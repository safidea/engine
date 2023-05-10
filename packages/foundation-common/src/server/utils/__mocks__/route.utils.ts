import type { RouteMiddlewaresType, RouteHandlerContextType } from '@common/server/types/route.type'
import type { RequestType } from '@common/server/types/request.type'

const handlerMock = jest.fn(
  (route: RouteMiddlewaresType) => async (req: Request, ctx: RouteHandlerContextType) => {
    const request: RequestType = {
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
