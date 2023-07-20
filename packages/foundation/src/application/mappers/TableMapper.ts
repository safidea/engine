import { TableDto } from '@application/dtos/TableDto'
import { Table } from '@domain/entities/Table'
import { mapDtoToField } from './FieldMapper'

export function mapDtoToTable(tableDto: TableDto): Table {
  return new Table(
    tableDto.name,
    tableDto.fields.map((fieldDto) => mapDtoToField(fieldDto))
  )
}
