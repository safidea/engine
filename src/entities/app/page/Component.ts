import { Link } from './components/Link'
import { Paragraph } from './components/Paragraph'
import { TitleComponent } from './components/TitleComponent'
import { Navigation } from './components/Navigation'
import { List } from './components/List'
import { Form } from './components/Form'
import { ContainerComponent } from './components/ContainerComponent'

export type Component =
  | Link
  | Paragraph
  | TitleComponent
  | Navigation
  | List
  | Form
  | ContainerComponent
