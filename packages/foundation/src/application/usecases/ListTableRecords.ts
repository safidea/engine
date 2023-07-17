import { TableRepository } from '@adapter/spi/repositories/TableRepository'

export class ListTableRecords {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string): Promise<any> {
    return this.tableRepository.list(table)
  }
}
