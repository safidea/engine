import { middlewarePipeline } from './middleware-pipeline'
import { Routes, NextApiRequest, NextApiResponse, MiddlewareFunction } from '../../types'

export function nextApiRouter(routes: Routes) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const { all, ...rest } = routes
    const route = rest[req.method.toLowerCase() as keyof typeof rest]
    if (route) {
      const middlewareFunctions: MiddlewareFunction[] = []
      if (all) {
        middlewareFunctions.push(...all(req, res))
      }
      middlewareFunctions.push(...route(req, res))
      await middlewarePipeline(req, res, middlewareFunctions)
    } else {
      res.setHeader(
        'Allow',
        Object.keys(rest).map((key) => key.toUpperCase())
      )
      return res.status(405).json({
        error: `Method ${req.method} not supported`,
      })
    }
  }
}
