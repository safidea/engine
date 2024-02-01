import { TableAPI, type CreateParams, type CreateResult } from '@adapter/api/TableApi'
import { drivers } from './infrastructure'

export async function createTable(config: unknown, params?: CreateParams): Promise<CreateResult> {
  return new TableAPI(drivers).create(config, params)
}
