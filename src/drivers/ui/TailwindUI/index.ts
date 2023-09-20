import LinkTailwindUI from './link/LinkTailwindUI'
import ParagraphTailwindUI from './paragraph/ParagraphTailwindUI'
import TitleTailwindUI from './title/TitleTailwindUI'
import NavigationTailwindUI from './navigation/NavigationTailwindUI'
import ListTailwindUI from './ListTailwindUI'
import FormTailwindUI from './FormTailwindUI'
import TableInputTailwindUI from './TableInputTailwindUI'
import TextInputTailwindUI from './TextInputTailwindUI'
import SingleSelectInputTailwindUI from './SingleSelectInputTailwindUI'
import ContainerTailwindUI from './ContainerTailwindUI'
import { IUIDriver } from '@adapters/mappers/ui/IUIDriver'

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
