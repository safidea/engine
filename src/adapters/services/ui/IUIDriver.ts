import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'
import { FormUI } from '@entities/app/page/component/form/FormComponentUI'
import { SingleSelectInputUI } from '@entities/app/page/component/form/input/singleSelect/SingleSelectInputComponentUI'
import { TableInputUI } from '@entities/app/page/component/form/input/table/TableInputComponentUI'
import { TextInputUI } from '@entities/app/page/component/form/input/text/TextInputComponentUI'
import { LinkUI } from '@entities/app/page/component/link/LinkComponentUI'
import { ListUI } from '@entities/app/page/component/list/ListComponentUI'
import { NavigationUI } from '@entities/app/page/component/navigation/NavigationComponentUI'
import { ParagraphUI } from '@entities/app/page/component/paragraph/ParagraphComponentUI'
import { TitleUI } from '@entities/app/page/component/title/TitleComponentUI'

export interface IUIDriver {
  name: string
  LinkUI: LinkUI
  ParagraphUI: ParagraphUI
  TitleUI: TitleUI
  NavigationUI: NavigationUI
  ListUI: ListUI
  FormUI: FormUI
  TextInputUI: TextInputUI
  TableInputUI: TableInputUI
  SingleSelectInputUI: SingleSelectInputUI
  ContainerUI: ContainerUI
}
