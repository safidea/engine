import { JSONSchemaType } from 'ajv'
import { TableDto, TableDtoSchema } from './inputs/TableDto'
import { TextDto, TextDtoSchema } from './inputs/TextDto'

export type InputDto = TextDto | TableDto

export const InputDtoSchema: JSONSchemaType<InputDto> = {
  oneOf: [TextDtoSchema, TableDtoSchema],
}
