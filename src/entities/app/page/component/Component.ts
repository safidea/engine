import { ComponentParams } from './ComponentParams'
import { PageConfig } from '../Page'
import { ContainerComponent } from './container/ContainerComponent'
import { FormComponent } from './form/FormComponent'
import { LinkComponent } from './link/LinkComponent'
import { ListComponent } from './list/ListComponent'
import { TitleComponent } from './title/TitleComponent'
import { NavigationComponent } from './navigation/NavigationComponent'
import { ParagraphComponent } from './paragraph/ParagraphComponent'
import { PageServices } from '../PageServices'
import { SingleSelectInputComponent } from './singleSelectInput/SingleSelectInputComponent'
import { SingleSelectRecordInputComponent } from './singleSelectRecordInput/SingleSelectRecordInputComponent'
import { TableInputComponent } from './tableInput/TableInputComponent'
import { TextInputComponent } from './textInput/TextInputComponent'
import { ColumnComponent } from './column/ColumnComponent'

export type Component =
  | LinkComponent
  | ParagraphComponent
  | TitleComponent
  | NavigationComponent
  | ListComponent
  | FormComponent
  | ContainerComponent
  | TextInputComponent
  | TableInputComponent
  | SingleSelectRecordInputComponent
  | SingleSelectInputComponent
  | ColumnComponent

export function newComponent(
  params: ComponentParams,
  services: PageServices,
  config: PageConfig
): Component {
  switch (params.type) {
    case 'link':
      return new LinkComponent(params, services, config)
    case 'paragraph':
      return new ParagraphComponent(params, services, config)
    case 'title':
      return new TitleComponent(params, services, config)
    case 'navigation':
      return new NavigationComponent(params, services, config)
    case 'list':
      return new ListComponent(params, services, config)
    case 'form':
      return new FormComponent(params, services, config)
    case 'container':
      return new ContainerComponent(params, services, config)
    case 'table_input':
      return new TableInputComponent(params, services, config)
    case 'text_input':
      return new TextInputComponent(params, services, config)
    case 'single_select_record_input':
      return new SingleSelectRecordInputComponent(params, services, config)
    case 'single_select_input':
      return new SingleSelectInputComponent(params, services, config)
    case 'column':
      return new ColumnComponent(params, services, config)
  }
}
