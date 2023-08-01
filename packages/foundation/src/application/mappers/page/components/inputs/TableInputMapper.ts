import { TableInputDto } from '@application/dtos/page/components/inputs/TableInputDto'
import { TableInput } from '@domain/entities/page/components/inputs/TableInput'
import { Table } from '@domain/entities/table/Table'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToTableInput(
  tableInputDto: TableInputDto,
  ui: IUIGateway,
  table: Table
): TableInput {
  const { field, columns, label, addLabel } = tableInputDto
  return new TableInput(field, columns, table, ui.TableInputUI, label, addLabel)
}

export function mapTableInputToDto(tableInput: TableInput): TableInputDto {
  const { label, field, columns, addLabel } = tableInput
  return {
    label,
    field,
    columns,
    addLabel,
  }
}
