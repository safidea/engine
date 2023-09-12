import { Link } from './common/link/Link'
import { Paragraph } from './common/paragraph/Paragraph'
import { TitleComponent } from './common/title/TitleComponent'
import { Navigation } from './common/navigation/Navigation'
import { List } from './component/List'
import { Form } from './form/FormComponent'
import { ContainerComponent } from './common/container/ContainerComponent'

export type Component =
  | Link
  | Paragraph
  | TitleComponent
  | Navigation
  | List
  | Form
  | ContainerComponent
