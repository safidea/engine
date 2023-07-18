import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { DataDto } from '@application/dtos/DataDto'
import { RecordDto } from '@application/dtos/RecordDto'

export class CreateManyTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, body: DataDto[]): Promise<RecordDto[]> {
    return this.tableRepository.createMany(table, body)
  }
}
