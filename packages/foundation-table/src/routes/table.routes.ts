import { RouterService } from 'foundation-common'
import type { NextApiRequest, MiddlewareFunction } from 'foundation-common'

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
  return [
    TableMiddleware.validateBody,
    TableMiddleware.validateBodyAllFields,
    TableController.create,
  ]
}

function patch(): MiddlewareFunction[] {
  return [
    TableMiddleware.validateBody,
    TableMiddleware.validateBodyFields,
    TableMiddleware.validateRowExist,
    TableController.update,
  ]
}

function put(): MiddlewareFunction[] {
  return [
    TableMiddleware.validateBody,
    TableMiddleware.validateBodyAllFields,
    TableMiddleware.validateRowExist,
    TableController.update,
  ]
}

function remove(): MiddlewareFunction[] {
  return [TableMiddleware.validateRowExist, TableController.remove]
}

export default RouterService.handler({
  all,
  get,
  post,
  patch,
  put,
  delete: remove,
})
