import type {
  IDatabase,
  IDatabaseInstance,
  IDatabaseRow,
  IDatabaseTable,
} from '@domain/drivers/IDatabase'
import type { TableList } from '@domain/entities/table/TableList'

export class SqliteDatabase implements IDatabase {
  create(tables: TableList) {
    return new SqliteDatabaseInstance(tables)
  }
}

class SqliteDatabaseInstance implements IDatabaseInstance {
  constructor(private tables: TableList) {}

  table(name: string) {
    return new SqliteDatabaseTable(name)
  }
}

class SqliteDatabaseTable implements IDatabaseTable {
  constructor(private name: string) {}

  create(data: IDatabaseRow) {
    console.log('create', this.name, data)
  }

  find(data: IDatabaseRow) {
    console.log('create', this.name, data)
    return {}
  }
}
