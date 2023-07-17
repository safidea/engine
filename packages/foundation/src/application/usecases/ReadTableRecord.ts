import { TableRepository } from '@adapter/spi/repositories/TableRepository'

export class ReadTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, id: string): Promise<any> {
    return this.tableRepository.read(table, id)
  }
}
