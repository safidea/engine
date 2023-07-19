import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { DataDto } from '@application/dtos/DataDto'

export class CreateManyTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, body: DataDto[]): Promise<string[]> {
    return this.tableRepository.createMany(table, body)
  }
}
