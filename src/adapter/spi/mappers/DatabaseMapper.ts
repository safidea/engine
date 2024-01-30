import type { IDatabaseMapper } from '@domain/mappers/IDatabaseMapper'
import { DatabaseTableMapper } from './DatabaseTableMapper'
import type { IDatabaseDriver } from '../drivers/IDatabaseDriver'

export class DatabaseMapper implements IDatabaseMapper {
  constructor(private driver: IDatabaseDriver) {}

  table(name: string) {
    const databaseTableDriver = this.driver.table(name)
    return new DatabaseTableMapper(databaseTableDriver)
  }
}
