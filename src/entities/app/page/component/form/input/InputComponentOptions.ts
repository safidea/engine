import { SingleSelectInputComponentOptions } from './singleSelect/SingleSelectInputComponentOptions'
import { SingleSelectRecordInputComponentOptions } from './singleSelectRecord/SingleSelectRecordInputComponentOptions'
import { TableInputComponentOptions } from './table/TableInputComponentOptions'
import { TextInputComponentOptions } from './text/TextInputComponentOptions'

export type InputComponentOptions =
  | TextInputComponentOptions
  | TableInputComponentOptions
  | SingleSelectRecordInputComponentOptions
  | SingleSelectInputComponentOptions
