import { JSONSchemaType } from 'ajv'
import { TableInputDto, TableDtoSchema } from './inputs/TableInputDto'
import { TextInputDto, TextDtoSchema } from './inputs/TextInputDto'
import {
  SingleSelectRecordInputDto,
  SingleSelectRecordInputDtoSchema,
} from './inputs/SingleSelectRecordInputDto'
import { SingleSelectInputDto, SingleSelectInputDtoSchema } from './inputs/SingleSelectInputDto'

export type InputDto =
  | TextInputDto
  | TableInputDto
  | SingleSelectRecordInputDto
  | SingleSelectInputDto

export const InputDtoSchema: JSONSchemaType<InputDto> = {
  anyOf: [
    TextDtoSchema,
    TableDtoSchema,
    SingleSelectRecordInputDtoSchema,
    SingleSelectInputDtoSchema,
  ],
}
