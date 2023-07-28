import { TableDto } from '@application/dtos/table/TableDto'
import { Table } from '@domain/entities/table/Table'
import { mapDtoToField, mapFieldToDto } from './FieldMapper'

export function mapDtoToTable(tableDto: TableDto): Table {
  return new Table(
    tableDto.name,
    tableDto.fields.map((fieldDto) => mapDtoToField(fieldDto))
  )
}

export function mapTableToDto(table: Table): TableDto {
  return {
    name: table.name,
    fields: table.fields.map((field) => mapFieldToDto(field)),
  }
}
