import { TableRepository } from '@adapter/spi/repositories/TableRepository'

export class CreateTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, body: any): Promise<any> {
    return this.tableRepository.create(table, body)
  }
}
