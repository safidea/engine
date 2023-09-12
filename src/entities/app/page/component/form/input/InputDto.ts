import { JSONSchemaType } from 'ajv'
import { TableInputDto, TableDtoSchema } from './input/TableInputDto'
import { TextInputDto, TextDtoSchema } from './input/TextInputDto'
import {
  SingleSelectRecordInputDto,
  SingleSelectRecordInputDtoSchema,
} from '../../../../../entities/app/page/components/inputs/SingleSelectRecordInputDto'
import {
  SingleSelectInputDto,
  SingleSelectInputDtoSchema,
} from './input/SingleSelectInputComponentSchema'

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
