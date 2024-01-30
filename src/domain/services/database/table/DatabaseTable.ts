import type { RecordToCreate } from '@domain/services/record/toCreate/RecordToCreate'
import type { IDatabaseMapper } from '../../../mappers/IDatabaseMapper'
import type { IDatabaseTableMapper } from '../../../mappers/IDatabaseTableMapper'

export class DatabaseTable {
  private table: IDatabaseTableMapper

  constructor(mapper: IDatabaseMapper, name: string) {
    this.table = mapper.table(name)
  }

  async insert(recordToCreate: RecordToCreate) {
    return this.table.insert(recordToCreate)
  }
}
