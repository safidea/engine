import { InputComponentParams } from './InputComponentParams'
import { SingleSelectInputComponent } from './singleSelect/SingleSelectInputComponent'
import { SingleSelectRecordInputComponent } from './singleSelectRecord/SingleSelectRecordInputComponent'
import { TableInputComponent } from './table/TableInputComponent'
import { TextInputComponent } from './text/TextInputComponent'
import { FormConfig } from '../FormComponent'
import { PageServices } from '@entities/app/page/PageServices'

export type InputComponent =
  | TableInputComponent
  | TextInputComponent
  | SingleSelectRecordInputComponent
  | SingleSelectInputComponent

export function newInput(
  params: InputComponentParams,
  services: PageServices,
  config: FormConfig
): InputComponent {
  switch (params.type) {
    case 'table':
      return new TableInputComponent(params, services, config)
    case 'text':
      return new TextInputComponent(params, services, config)
    case 'single_select_record':
      return new SingleSelectRecordInputComponent(params, services, config)
    case 'single_select':
      return new SingleSelectInputComponent(params, services, config)
  }
}
