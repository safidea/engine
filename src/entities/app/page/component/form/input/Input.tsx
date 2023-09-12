import { SingleSelectInput } from './singleSelect/SingleSelectInputComponent'
import { SingleSelectRecordInput } from './input/SingleSelectRecordInput'
import { TableInput } from './table/TableInputComponent'
import { TextInput } from './text/TextInput'

export type Input = TableInput | TextInput | SingleSelectRecordInput | SingleSelectInput
