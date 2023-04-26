import type {
  RouterInterface,
  ApiRequestInterface,
  ApiResponseInterface,
  RouterMiddlewareType,
} from '@common'

class RouterUtils {
  public handler(Routes: RouterInterface): RouterMiddlewareType {
    return async function (req: ApiRequestInterface, res: ApiResponseInterface) {
      req.locals = {}

      const method = req.method.toLowerCase() as keyof typeof Routes
      const route = Routes[method]
      if (typeof route !== 'function') {
        return res.status(405).json({
          error: `Method ${req.method} not supported`,
        })
      }

      const middlewares: RouterMiddlewareType[] = []
      if (typeof Routes.all === 'function') middlewares.push(...Routes.all(req, res))
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
