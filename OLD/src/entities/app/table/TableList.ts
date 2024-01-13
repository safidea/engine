import { DatabaseService } from '@entities/services/database/DatabaseService'
import { AppMappers } from '../AppMappers'
import { Table } from './Table'
import { TableParams } from './TableParams'
import { TableServices } from './TableServices'

export class TableList {
  private readonly tables: Table[] = []
  private readonly services?: TableServices

  constructor(tables: TableParams[], mappers: AppMappers) {
    if (tables.length > 0) {
      const { database } = mappers
      if (!database) throw new Error('Database is required')
      const services = { database: new DatabaseService(database) }
      this.tables = tables.map((table) => new Table(table, services))
      this.services = services
    }
  }

  get database(): DatabaseService {
    if (!this.services) throw new Error('Database is required')
    return this.services.database
  }

  getByName(tableName: string): Table | undefined {
    return this.tables.find((t: Table) => t.name === tableName)
  }

  getAll(): Table[] {
    return this.tables
  }

  getAllParams(): TableParams[] {
    return this.tables.map((table: Table) => table.params)
  }

  getNames(): string[] {
    return this.tables.map((table: Table) => table.name)
  }

  exist(): boolean {
    return this.tables.length > 0
  }
}
