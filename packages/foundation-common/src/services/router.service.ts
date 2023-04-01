import { Routes, NextApiRequest, NextApiResponse, MiddlewareFunction } from '../../types'

export function handler(routes: Routes) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const { all, ...rest } = routes
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

    const middlewareFunctions: MiddlewareFunction[] = []
    req.locals = {}

    if (all) middlewareFunctions.push(...all(req, res))
    middlewareFunctions.push(...route(req, res))

    async function nextMiddlewareFunction() {
      const currentMiddlewareFunction = middlewareFunctions.shift()
      if (currentMiddlewareFunction)
        await currentMiddlewareFunction(req, res, nextMiddlewareFunction)
    }

    await nextMiddlewareFunction()
  }
}
