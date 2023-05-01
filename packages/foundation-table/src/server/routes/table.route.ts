import TableMiddleware from '@table/server/middlewares/table.middleware'
import TableController from '@table/server/controllers/table.controller'

import type { RouterInterface, ApiRequestInterface } from '@common'

class TableRoute implements RouterInterface {
  public all() {
    return [TableMiddleware.validateBaseExist, TableMiddleware.validateTableExist]
  }

  public get(req: ApiRequestInterface) {
    if (req.query.id) {
      return [TableMiddleware.validateRowExist, TableController.read]
    }
    return [TableController.list]
  }

  public post() {
    return [
      TableMiddleware.validateBody,
      TableMiddleware.validateBodyAllFields,
      TableController.create,
    ]
  }

  public patch() {
    return [
      TableMiddleware.validateBody,
      TableMiddleware.validateBodyFields,
      TableMiddleware.validateRowExist,
      TableController.update,
    ]
  }

  public put() {
    return [
      TableMiddleware.validateBody,
      TableMiddleware.validateBodyAllFields,
      TableMiddleware.validateRowExist,
      TableController.update,
    ]
  }

  public delete() {
    return [TableMiddleware.validateRowExist, TableController.delete]
  }
}

export default new TableRoute()
