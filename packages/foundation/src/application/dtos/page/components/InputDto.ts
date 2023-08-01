import { JSONSchemaType } from 'ajv'
import { TableInputDto, TableDtoSchema } from './inputs/TableInputDto'
import { TextInputDto, TextDtoSchema } from './inputs/TextInputDto'

export type InputDto = TextInputDto | TableInputDto

export const InputDtoSchema: JSONSchemaType<InputDto> = {
  oneOf: [TextDtoSchema, TableDtoSchema],
}
