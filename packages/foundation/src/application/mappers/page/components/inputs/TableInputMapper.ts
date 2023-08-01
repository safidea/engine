import { TableInputDto } from '@application/dtos/page/components/inputs/TableInputDto'
import { TableInput } from '@domain/entities/page/components/inputs/TableInput'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToTableInput(tableInputDto: TableInputDto, ui: IUIGateway): TableInput {
  const { field, columns, label, addLabel } = tableInputDto
  return new TableInput(field, columns, ui.TableInputUI, label, addLabel)
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
