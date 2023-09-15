import * as t from 'io-ts'
import { SingleSelectInputComponentParams } from './singleSelect/SingleSelectInputComponentParams'
import { SingleSelectRecordInputComponentParams } from './singleSelectRecord/SingleSelectRecordInputComponentParams'
import { TableInputComponentParams } from './table/TableInputComponentParams'
import { TextInputComponentParams } from './text/TextInputComponentParams'

export const InputComponentParams = t.union([
  TextInputComponentParams,
  TableInputComponentParams,
  SingleSelectRecordInputComponentParams,
  SingleSelectInputComponentParams,
])

export type InputComponentParams = t.TypeOf<typeof InputComponentParams>
