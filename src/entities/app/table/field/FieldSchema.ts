import { JSONSchemaType } from 'ajv'
import { FieldOptions } from './FieldOptions'
import { AutonumberFieldSchema } from './autonumber/AutonumberFieldSchema'
import { DatetimeFieldSchema } from './datetime/DatetimeFieldSchema'
import { LongTextFieldSchema } from './longText/LongTextFieldSchema'
import { NumberFieldSchema } from './number/NumberFieldSchema'
import { RollupFieldSchema } from './rollup/RollupFieldSchema'
import { SingleLineTextFieldSchema } from './singleLineText/SingleLineTextFieldSchema'
import { SingleLinkedRecordFieldSchema } from './singleLinkedRecord/SingleLinkedRecordFieldSchema'
import { SingleSelectFieldSchema } from './singleSelectField/SingleSelectFieldSchema'
import { UrlFieldSchema } from './url/UrlFieldSchema'
import { CurrencyFieldSchema } from './currency/CurrencyFieldSchema'
import { FormulaFieldSchema } from './formula/FormulaFieldSchema'
import { MultipleLinkedRecordsFieldSchema } from './multipleLinkedRecords/MultipleLinkedRecordsFieldSchema'

export const FieldSchema: JSONSchemaType<FieldOptions> = {
  oneOf: [
    SingleLineTextFieldSchema,
    LongTextFieldSchema,
    CurrencyFieldSchema,
    NumberFieldSchema,
    FormulaFieldSchema,
    SingleLinkedRecordFieldSchema,
    MultipleLinkedRecordsFieldSchema,
    RollupFieldSchema,
    DatetimeFieldSchema,
    SingleSelectFieldSchema,
    AutonumberFieldSchema,
    UrlFieldSchema,
  ],
}
