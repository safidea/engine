import { TableController } from '@adapter/api/controllers/TableController'
import { drivers as defaultDrivers } from '@infra/Drivers'
import type { CreateTableParamsDto } from '@adapter/api/dtos/CreateTableParamsDto'
import type { CreateTableResultDto } from '@adapter/api/dtos/CreateTableResultDto'

export type { TableDto as Table } from '@domain/entities/table/TableDto'

export async function createTable(
  config: unknown,
  params?: CreateTableParamsDto
): Promise<CreateTableResultDto> {
  const { drivers = {} } = params ?? {}
  return new TableController({ ...defaultDrivers, ...drivers }).create(config)
}
