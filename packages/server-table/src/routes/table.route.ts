import { ConfigUtils } from 'server-common'
import TableMiddleware from '../middlewares/table.middleware'
import TableController from '../controllers/table.controller'
import TableService from '../services/table.service'

import type {
  RequestInterface,
  RequestBodyInterface,
  RequestArrayBodyInterface,
  ResponseInterface,
} from 'shared-app'
import { DatabaseService } from 'server-database'

class TableRoute {
  private tableMiddleware: TableMiddleware
  private tableController: TableController

  constructor({
    databaseService,
    configUtils,
  }: {
    databaseService: DatabaseService
    configUtils: ConfigUtils
  }) {
    const tableService = new TableService({ databaseService })
    this.tableMiddleware = new TableMiddleware({ configUtils, databaseService })
    this.tableController = new TableController({ tableService })
  }

  public async all(req: RequestInterface): Promise<void> {
    await this.tableMiddleware.validateTableExist(req)
  }

  public async get(req: RequestInterface): Promise<ResponseInterface> {
    if (req.params.id) {
      await this.tableMiddleware.validateRowExist(req)
      return this.tableController.read(req)
    }
    return this.tableController.list(req)
  }

  // TODO: Add support for array body and remove "as" casts
  public async post(
    req: RequestBodyInterface | RequestArrayBodyInterface
  ): Promise<ResponseInterface> {
    if (Array.isArray(req.body)) {
      await this.tableMiddleware.validatePostArrayBody(req as RequestArrayBodyInterface)
      return this.tableController.createMany(req as RequestArrayBodyInterface)
    }
    await this.tableMiddleware.validatePostBody(req as RequestBodyInterface)
    return this.tableController.create(req as RequestBodyInterface)
  }

  public async patch(req: RequestBodyInterface): Promise<ResponseInterface> {
    await this.tableMiddleware.validatePatchBody(req)
    await this.tableMiddleware.validateRowExist(req)
    return this.tableController.update(req)
  }

  public async put(req: RequestBodyInterface): Promise<ResponseInterface> {
    await this.tableMiddleware.validatePutBody(req)
    await this.tableMiddleware.validateRowExist(req)
    return this.tableController.update(req)
  }

  public async delete(req: RequestInterface): Promise<ResponseInterface> {
    await this.tableMiddleware.validateRowExist(req)
    return this.tableController.delete(req)
  }
}

export default TableRoute
