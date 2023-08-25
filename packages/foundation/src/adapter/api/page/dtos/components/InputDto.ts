import { JSONSchemaType } from 'ajv'
import { TableInputDto, TableDtoSchema } from './inputs/TableInputDto'
import { TextInputDto, TextDtoSchema } from './inputs/TextInputDto'
import {
  SingleSelectRecordInputDto,
  SingleSelectRecordInputDtoSchema,
} from './inputs/SingleSelectRecordInputDto'

export type InputDto = TextInputDto | TableInputDto | SingleSelectRecordInputDto

export const InputDtoSchema: JSONSchemaType<InputDto> = {
  anyOf: [TextDtoSchema, TableDtoSchema, SingleSelectRecordInputDtoSchema],
}
