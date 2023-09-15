import { AppDrivers } from '@entities/app/App'
import { InputComponentParams } from './InputComponentParams'
import { SingleSelectInputComponent } from './singleSelect/SingleSelectInputComponent'
import { SingleSelectRecordInputComponent } from './singleSelectRecord/SingleSelectRecordInputComponent'
import { TableInputComponent } from './table/TableInputComponent'
import { TextInputComponent } from './text/TextInputComponent'
import { FormConfig } from '../FormComponent'

export type InputComponent =
  | TableInputComponent
  | TextInputComponent
  | SingleSelectRecordInputComponent
  | SingleSelectInputComponent

export function newInput(
  params: InputComponentParams,
  drivers: AppDrivers,
  config: FormConfig
): InputComponent {
  switch (params.type) {
    case 'table':
      return new TableInputComponent(params, drivers, config)
    case 'text':
      return new TextInputComponent(params, drivers, config)
    case 'single_select_record':
      return new SingleSelectRecordInputComponent(params, drivers, config)
    case 'single_select':
      return new SingleSelectInputComponent(params, drivers, config)
  }
}
