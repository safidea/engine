import { AppDrivers } from '@entities/app/App'
import { InputComponentOptions } from './InputComponentOptions'
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
  options: InputComponentOptions,
  drivers: AppDrivers,
  config: FormConfig
): InputComponent {
  switch (options.type) {
    case 'table':
      return new TableInputComponent(options, drivers, config)
    case 'text':
      return new TextInputComponent(options, drivers, config)
    case 'single_select_record':
      return new SingleSelectRecordInputComponent(options, drivers, config)
    case 'single_select':
      return new SingleSelectInputComponent(options, drivers, config)
  }
}
