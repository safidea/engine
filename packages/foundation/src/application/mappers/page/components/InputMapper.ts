import { InputDto } from '@application/dtos/page/components/InputDto'
import { mapDtoToTableInput, mapTableInputToDto } from './inputs/TableInputMapper'
import { mapDtoToTextInput, mapTextInputToDto } from './inputs/TextInputMapper'
import { TextInput } from '@domain/entities/page/components/inputs/TextInput'
import { TableInput } from '@domain/entities/page/components/inputs/TableInput'
import { Input } from '@domain/entities/page/components/Input'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { Table } from '@domain/entities/table/Table'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'

export function mapDtoToInput(
  inputDto: InputDto,
  ui: IUIGateway,
  tableName: string,
  tables: Table[]
): Input {
  const table = tables.find((table) => table.name === tableName)
  if (!table) {
    throw new Error(`table ${tableName} is not defined in tables`)
  }
  const field = table.fields.find((field) => field.name === inputDto.field)
  if (!field) {
    throw new Error(`field ${inputDto.field} is not defined in table ${table}`)
  }
  if (field instanceof MultipleLinkedRecords && 'columns' in inputDto) {
    const linkedTable = tables.find((table) => table.name === field.table)
    if (!linkedTable) {
      throw new Error(`linked table ${field.table} is not defined in tables`)
    }
    return mapDtoToTableInput(inputDto, ui, linkedTable)
  }
  return mapDtoToTextInput(inputDto, ui)
}

export function mapInputToDto(input: Input): InputDto {
  const { type } = input
  if (input instanceof TextInput) {
    return mapTextInputToDto(input)
  }
  if (input instanceof TableInput) {
    return mapTableInputToDto(input)
  }
  throw new Error(`Invalid input type ${type}`)
}
