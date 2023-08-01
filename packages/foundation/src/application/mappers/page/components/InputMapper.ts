import { InputDto } from '@application/dtos/page/components/InputDto'
import { mapDtoToTableInput, mapTableInputToDto } from './inputs/TableInputMapper'
import { mapDtoToTextInput, mapTextInputToDto } from './inputs/TextInputMapper'
import { TextInput } from '@domain/entities/page/components/inputs/TextInput'
import { TableInput } from '@domain/entities/page/components/inputs/TableInput'
import { Input } from '@domain/entities/page/components/Input'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { Field } from '@domain/entities/table/Field'

export function mapDtoToInput(
  inputDto: InputDto,
  ui: IUIGateway,
  fields: Field[],
  table: string
): Input {
  const field = fields.find((field) => field.name === inputDto.field)
  if (!field) {
    throw new Error(`field ${inputDto.field} is not defined in table ${table}`)
  }
  if (['multiple_linked_records'].includes(field.type) && 'columns' in inputDto) {
    return mapDtoToTableInput(inputDto, ui)
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
