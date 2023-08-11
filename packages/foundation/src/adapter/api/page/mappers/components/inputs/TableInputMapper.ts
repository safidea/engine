import { TableInputDto } from '@adapter/api/page/dtos/components/inputs/TableInputDto'
import { TableInput } from '@domain/entities/page/components/inputs/TableInput'
import { Table } from '@domain/entities/table/Table'
import { IUISpi } from '@domain/spi/IUISpi'

export class TableInputMapper {
  static toEntity(tableInputDto: TableInputDto, ui: IUISpi, table: Table): TableInput {
    const { field, columns, label, addLabel } = tableInputDto
    return new TableInput(field, columns, table, ui.TableInputUI, label, addLabel)
  }

  static toDto(tableInput: TableInput): TableInputDto {
    const { label, field, columns, addLabel } = tableInput
    return {
      label,
      field,
      columns,
      addLabel,
    }
  }

  static toEntities(tableInputDtos: TableInputDto[], ui: IUISpi, table: Table): TableInput[] {
    return tableInputDtos.map((tableInputDto) => this.toEntity(tableInputDto, ui, table))
  }

  static toDtos(tableInputs: TableInput[]): TableInputDto[] {
    return tableInputs.map((tableInput) => this.toDto(tableInput))
  }
}
