import { JSONSchemaType } from 'ajv'
import { InputComponentOptions } from './InputComponentOptions'
import { TextInputComponentSchema } from './text/TextInputComponentSchema'
import { TableInputComponentSchema } from './table/TableInputComponentSchema'
import { SingleSelectRecordInputComponentSchema } from './singleSelectRecord/SingleSelectRecordInputComponentSchema'

export const InputComponentSchema: JSONSchemaType<InputComponentOptions> = {
  anyOf: [
    TextInputComponentSchema,
    TableInputComponentSchema,
    SingleSelectRecordInputComponentSchema,
    SingleSelectRecordInputComponentSchema,
  ],
}
