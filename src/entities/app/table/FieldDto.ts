import { JSONSchemaType } from 'ajv'
import { CurrencyFieldDto, CurrencyFieldDtoSchema } from './fields/CurrencyFieldDto'
import { DatetimeFieldDto, DatetimeDtoSchema } from './fields/DatetimeFieldDto'
import { FormulaFieldDto, FormulaFieldDtoSchema } from './fields/FormulaFieldDto'
import { LongTextFieldDto, LongTextDtoSchema } from './fields/LongTextFieldDto'
import {
  MultipleLinkedRecordFieldDto,
  MultipleLinkedRecordDtoSchema,
} from './fields/MultipleLinkedRecordFieldDto'
import { NumberFieldDto, NumberDtoSchema } from './fields/NumberFieldDto'
import { RollupFieldDto, RollupDtoSchema } from './fields/RollupFieldDto'
import { SingleLineTextFieldDto, SingleLineTextDtoSchema } from './fields/SingleLineTextFieldDto'
import {
  SingleLinkedRecordFieldDto,
  SingleLinkedRecordDtoSchema,
} from './fields/SingleLinkedRecordFieldDto'
import { SingleSelectFieldDto, SingleSelectDtoSchema } from './fields/SingleSelectFieldDto'
import { AutonumberFieldDto, AutonumberDtoSchema } from './fields/AutonumberFieldDto'
import { UrlFieldDto, UrlDtoSchema } from '../../../../entities/app/table/fields/UrlFieldDto'

export type FieldDto =
  | SingleLineTextFieldDto
  | LongTextFieldDto
  | CurrencyFieldDto
  | NumberFieldDto
  | FormulaFieldDto
  | SingleLinkedRecordFieldDto
  | MultipleLinkedRecordFieldDto
  | RollupFieldDto
  | DatetimeFieldDto
  | SingleSelectFieldDto
  | AutonumberFieldDto
  | UrlFieldDto

export const FieldDtoSchema: JSONSchemaType<FieldDto> = {
  oneOf: [
    SingleLineTextDtoSchema,
    LongTextDtoSchema,
    CurrencyFieldDtoSchema,
    NumberDtoSchema,
    FormulaFieldDtoSchema,
    SingleLinkedRecordDtoSchema,
    MultipleLinkedRecordDtoSchema,
    RollupDtoSchema,
    DatetimeDtoSchema,
    SingleSelectDtoSchema,
    AutonumberDtoSchema,
    UrlDtoSchema,
  ],
}
