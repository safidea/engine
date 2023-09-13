import { ComponentOptions } from './ComponentOptions'
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
  options: ComponentOptions,
  drivers: AppDrivers,
  config: PageConfig
): Component {
  switch (options.type) {
    case 'link':
      return new LinkComponent(options, drivers, config)
    case 'paragraph':
      return new ParagraphComponent(options, drivers, config)
    case 'title':
      return new TitleComponent(options, drivers, config)
    case 'navigation':
      return new NavigationComponent(options, drivers, config)
    case 'list':
      return new ListComponent(options, drivers, config)
    case 'form':
      return new FormComponent(options, drivers, config)
    case 'container':
      return new ContainerComponent(options, drivers, config)
  }
}
