import { Routes, NextApiRequest, NextApiResponse, MiddlewareFunction } from '../../types'

function methodNotAllowed(req: NextApiRequest, res: NextApiResponse, allowed: string[]) {
  res.setHeader(
    'Allow',
    allowed.map((key) => key.toUpperCase())
  )
  return res.status(405).json({
    error: `Method ${req.method} not supported`,
  })
}

async function middlewarePipeline(
  req: NextApiRequest,
  res: NextApiResponse,
  middlewareFunctions: MiddlewareFunction[]
) {
  async function nextMiddlewareFunction() {
    const currentMiddlewareFunction = middlewareFunctions.shift()
    if (currentMiddlewareFunction) await currentMiddlewareFunction(req, res, nextMiddlewareFunction)
  }
  await nextMiddlewareFunction()
}

export default function RouterService(routes: Routes) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    req.locals = {}
    const { all, ...rest } = routes
    const route = rest[req.method.toLowerCase() as keyof typeof rest]
    const middlewareFunctions: MiddlewareFunction[] = []
    if (!route) return methodNotAllowed(req, res, Object.keys(rest))
    if (all) middlewareFunctions.push(...all(req, res))
    middlewareFunctions.push(...route(req, res))
    await middlewarePipeline(req, res, middlewareFunctions)
  }
}
