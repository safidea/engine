import type { NextApiRequest, MiddlewareFunction } from 'foundation-utils'
import { nextApiRouter } from 'foundation-utils'

import * as TableController from '../controllers/table.controller'
import * as TableMiddleware from '../middlewares/table.middleware'

function all(): MiddlewareFunction[] {
  return [TableMiddleware.validateTableExist]
}

function get(req: NextApiRequest): MiddlewareFunction[] {
  if (req.query.id) {
    return [TableMiddleware.validateRowExist, TableController.read]
  }
  return [TableController.list]
}

function post(): MiddlewareFunction[] {
  return [TableMiddleware.validateBody, TableController.create]
}

function patch(): MiddlewareFunction[] {
  return [TableMiddleware.validateBody, TableMiddleware.validateRowExist, TableController.update]
}

function put(): MiddlewareFunction[] {
  return [TableMiddleware.validateBody, TableMiddleware.validateRowExist, TableController.update]
}

function remove(): MiddlewareFunction[] {
  return [TableMiddleware.validateRowExist, TableController.remove]
}

export default nextApiRouter({
  all,
  get,
  post,
  patch,
  put,
  delete: remove,
})
