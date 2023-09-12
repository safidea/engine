import { JSONSchemaType } from 'ajv'
import { CurrencyFieldDto, CurrencyFieldDtoSchema } from './currency/CurrencyFieldDto'
import { DatetimeFieldDto, DatetimeDtoSchema } from './field/DatetimeFieldDto'
import { FormulaFieldDto, FormulaFieldDtoSchema } from './field/FormulaFieldDto'
import { LongTextFieldDto, LongTextDtoSchema } from './field/LongTextFieldDto'
import {
  MultipleLinkedRecordFieldDto,
  MultipleLinkedRecordDtoSchema,
} from './multipleLinkedRecords/MultipleLinkedRecordFieldDto'
import { NumberFieldDto, NumberDtoSchema } from './number/NumberFieldDto'
import { RollupFieldDto, RollupDtoSchema } from './rollup/RollupFieldDto'
import { SingleLineTextFieldDto, SingleLineTextDtoSchema } from './field/SingleLineTextFieldDto'
import {
  SingleLinkedRecordFieldDto,
  SingleLinkedRecordDtoSchema,
} from './field/SingleLinkedRecordFieldDto'
import { SingleSelectFieldDto, SingleSelectDtoSchema } from './field/SingleSelectFieldDto'
import { AutonumberFieldDto, AutonumberDtoSchema } from './field/AutonumberFieldDto'
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
