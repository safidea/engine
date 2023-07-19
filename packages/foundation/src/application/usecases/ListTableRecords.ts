import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { RecordDto } from '@application/dtos/RecordDto'

export class ListTableRecords {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string): Promise<RecordDto[]> {
    return this.tableRepository.list(table)
  }
}
