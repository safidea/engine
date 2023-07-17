import { TableDto } from '@application/dtos/TableDto'
import { Invoice } from './types'

export class Helpers {
  getTableSchema(name: string): TableDto {
    return {} as TableDto
  }

  generateTableRecords(name: string, count: number) {
    return [] as Invoice[]
  }
}
