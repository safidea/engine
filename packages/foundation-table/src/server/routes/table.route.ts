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
    return [TableMiddleware.validatePostBody, TableController.create]
  }

  public patch() {
    return [
      TableMiddleware.validatePatchBody,
      TableMiddleware.validateRowExist,
      TableController.update,
    ]
  }

  public put() {
    return [
      TableMiddleware.validatePutBody,
      TableMiddleware.validateRowExist,
      TableController.update,
    ]
  }

  public delete() {
    return [TableMiddleware.validateRowExist, TableController.delete]
  }
}

export default new TableRoute()
