import { RouteUtils } from '@common/server'
import TableMiddleware from '@table/server/middlewares/table.middleware'
import TableController from '@table/server/controllers/table.controller'

import type {
  RouteInterface,
  RouteMiddlewaresType,
  RouteHandlerType,
  RequestType,
} from '@common/server'

class TableRoute implements RouteInterface {
  private handler(middlewares: RouteMiddlewaresType): RouteHandlerType {
    return RouteUtils.handler((req) => [
      TableMiddleware.validateBaseExist,
      TableMiddleware.validateTableExist,
      ...middlewares(req),
    ])
  }

  public GET = this.handler((req: RequestType) => {
    if (req.query.id) {
      return [TableMiddleware.validateRowExist, TableController.read]
    }
    return [TableController.list]
  })

  public POST = this.handler(() => [TableMiddleware.validatePostBody, TableController.create])

  public PATCH = this.handler(() => [
    TableMiddleware.validatePatchBody,
    TableMiddleware.validateRowExist,
    TableController.update,
  ])

  public PUT = this.handler(() => [
    TableMiddleware.validatePutBody,
    TableMiddleware.validateRowExist,
    TableController.update,
  ])

  public DELETE = this.handler(() => [TableMiddleware.validateRowExist, TableController.delete])
}

export default new TableRoute()
