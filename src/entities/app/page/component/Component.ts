import { ComponentParams } from './ComponentParams'
import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '../Page'
import { ContainerComponent } from './container/ContainerComponent'
import { FormComponent } from './form/FormComponent'
import { LinkComponent } from './link/LinkComponent'
import { ListComponent } from './list/ListComponent'
import { TitleComponent } from './title/TitleComponent'
import { NavigationComponent } from './navigation/NavigationComponent'
import { ParagraphComponent } from './paragraph/ParagraphComponent'

export type Component =
  | LinkComponent
  | ParagraphComponent
  | TitleComponent
  | NavigationComponent
  | ListComponent
  | FormComponent
  | ContainerComponent

export function newComponent(
  params: ComponentParams,
  drivers: AppDrivers,
  config: PageConfig
): Component {
  switch (params.type) {
    case 'link':
      return new LinkComponent(params, drivers, config)
    case 'paragraph':
      return new ParagraphComponent(params, drivers, config)
    case 'title':
      return new TitleComponent(params, drivers, config)
    case 'navigation':
      return new NavigationComponent(params, drivers, config)
    case 'list':
      return new ListComponent(params, drivers, config)
    case 'form':
      return new FormComponent(params, drivers, config)
    case 'container':
      return new ContainerComponent(params, drivers, config)
  }
}
