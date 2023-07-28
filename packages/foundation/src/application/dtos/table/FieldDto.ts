import { JSONSchemaType } from '@application/utils/SchemaValidator'
import { CurrencyDto, CurrencyDtoSchema } from './fields/CurrencyDto'
import { DatetimeDto, DatetimeDtoSchema } from './fields/DatetimeDto'
import { FormulaDto, FormulaDtoSchema } from './fields/FormulaDto'
import { LongTextDto, LongTextDtoSchema } from './fields/LongTextDto'
import {
  MultipleLinkedRecordDto,
  MultipleLinkedRecordDtoSchema,
} from './fields/MultipleLinkedRecordDto'
import { NumberDto, NumberDtoSchema } from './fields/NumberDto'
import { RollupDto, RollupDtoSchema } from './fields/RollupDto'
import { SingleLineTextDto, SingleLineTextDtoSchema } from './fields/SingleLineTextDto'
import { SingleLinkedRecordDto, SingleLinkedRecordDtoSchema } from './fields/SingleLinkedRecordDto'
import { SingleSelectDto, SingleSelectDtoSchema } from './fields/SingleSelectDto'

export type FieldDto =
  | SingleLineTextDto
  | LongTextDto
  | CurrencyDto
  | NumberDto
  | FormulaDto
  | SingleLinkedRecordDto
  | MultipleLinkedRecordDto
  | RollupDto
  | DatetimeDto
  | SingleSelectDto

export const FieldDtoSchema: JSONSchemaType<FieldDto> = {
  oneOf: [
    SingleLineTextDtoSchema,
    LongTextDtoSchema,
    CurrencyDtoSchema,
    NumberDtoSchema,
    FormulaDtoSchema,
    SingleLinkedRecordDtoSchema,
    MultipleLinkedRecordDtoSchema,
    RollupDtoSchema,
    DatetimeDtoSchema,
    SingleSelectDtoSchema,
  ],
}
