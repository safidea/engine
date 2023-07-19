import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { RecordDto } from '@application/dtos/RecordDto'

export class ReadTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, id: string): Promise<RecordDto> {
    const record = await this.tableRepository.read(table, id)
    const fields = await this.tableRepository.getTableFields(table)
    for (const field of fields) {
      if (field.type === 'formula') {
        const value = await this.tableRepository.runFormula(field.formula, { ...record })
        record[field.name] = value
      }
    }
    return record
  }
}
