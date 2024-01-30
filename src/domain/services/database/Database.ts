import { DatabaseTable } from './table/DatabaseTable'
import type { IDatabaseMapper } from '../../mappers/IDatabaseMapper'

export class Database {
  constructor(private mapper: IDatabaseMapper) {}

  table(name: string) {
    return new DatabaseTable(this.mapper, name)
  }
}
