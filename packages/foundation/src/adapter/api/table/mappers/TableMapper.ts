import { Table } from '@domain/entities/table/Table'
import { TableDto } from '../dtos/TableDto'
import { FieldMapper } from './FieldMapper'

export class TableMapper {
  static toEntity(tableDto: TableDto): Table {
    return new Table(
      tableDto.name,
      FieldMapper.toEntities(tableDto.fields)
    )
  }

  static toDto(table: Table): TableDto {
    return {
      name: table.name,
      fields: FieldMapper.toDtos(table.fields),
    }
  }

  static toEntities(tablesDto: TableDto[]): Table[] {
    return tablesDto.map((tableDto) => this.toEntity(tableDto))
  }

  static toDtos(tables: Table[]): TableDto[] {
    return tables.map((table) => this.toDto(table))
  }
}
