import { NextApiRequest, NextApiResponse, MiddlewareFunction } from '../../types'

export async function middlewarePipeline(
  req: NextApiRequest,
  res: NextApiResponse,
  middlewareFunctions: MiddlewareFunction[]
) {
  async function nextMiddlewareFunction(err?: Error) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    const currentMiddlewareFunction = middlewareFunctions.shift()
    if (currentMiddlewareFunction) {
      await currentMiddlewareFunction(req, res, nextMiddlewareFunction)
    }
  }

  await nextMiddlewareFunction()
}
