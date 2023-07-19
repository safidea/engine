import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { DataDto } from '@application/dtos/DataDto'

export class CreateTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, body: DataDto): Promise<string> {
    return this.tableRepository.create(table, body)
  }
}
