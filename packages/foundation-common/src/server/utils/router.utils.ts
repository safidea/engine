import type {
  RouterInterface,
  ApiRequestInterface,
  ApiResponseInterface,
  RouterMiddlewareType,
} from '@common'

class RouterUtils {
  public handler(Routes: RouterInterface): RouterMiddlewareType {
    return async function (req: ApiRequestInterface, res: ApiResponseInterface) {
      const { all, ...rest } = Routes
      req.locals = {}

      const route = rest[req.method.toLowerCase() as keyof typeof rest]
      if (!route) {
        res.setHeader(
          'Allow',
          Object.keys(rest).map((key) => key.toUpperCase())
        )
        return res.status(405).json({
          error: `Method ${req.method} not supported`,
        })
      }

      const middlewares: RouterMiddlewareType[] = []
      if (all) middlewares.push(...all(req, res))
      middlewares.push(...route(req, res))

      async function nextMiddleware() {
        const currentMiddleware = middlewares.shift()
        if (currentMiddleware) await currentMiddleware(req, res, nextMiddleware)
      }
      await nextMiddleware()
    }
  }
}

export default new RouterUtils()
