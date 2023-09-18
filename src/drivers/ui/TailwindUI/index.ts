import LinkTailwindUI from './LinkTailwindUI'
import ParagraphTailwindUI from './ParagraphTailwindUI'
import TitleTailwindUI from './TitleTailwindUI'
import NavigationTailwindUI from './NavigationTailwindUI'
import ListTailwindUI from './ListTailwindUI'
import FormTailwindUI from './FormTailwindUI'
import TableInputTailwindUI from './TableInputTailwindUI'
import TextInputTailwindUI from './TextInputTailwindUI'
import SingleSelectInputTailwindUI from './SingleSelectInputTailwindUI'
import ContainerTailwindUI from './ContainerTailwindUI'
import { IUIDriver } from '@adapters/services/ui/IUIDriver'

const TailwindUI: IUIDriver = {
  name: 'tailwind',
  LinkUI: LinkTailwindUI,
  ParagraphUI: ParagraphTailwindUI,
  TitleUI: TitleTailwindUI,
  NavigationUI: NavigationTailwindUI,
  ListUI: ListTailwindUI,
  FormUI: FormTailwindUI,
  TextInputUI: TextInputTailwindUI,
  TableInputUI: TableInputTailwindUI,
  SingleSelectInputUI: SingleSelectInputTailwindUI,
  ContainerUI: ContainerTailwindUI,
}

export default TailwindUI
