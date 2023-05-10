import type { RouteMiddlewaresType, RouteHandlerContextType } from '@common/server'

const handlerMock = jest.fn(
  (route: RouteMiddlewaresType) => async (request: Request, context: RouteHandlerContextType) =>
    route({
      locals: {},
      query: context.params,
      body: request.json(),
    })
)

const RouteUtils = {
  handler: handlerMock,
}

export default RouteUtils
