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

export interface IUIService {
  name: string
  getTitle: () => TitleUI
  getParagraph: () => ParagraphUI
  getNavigation: () => NavigationUI
  getList: () => ListUI
  getLink: () => LinkUI
  getForm: () => FormUI
  getContainer: () => ContainerUI
  getTextInput: () => TextInputUI
  getTableInput: () => TableInputUI
  getSingleSelectIntput: () => SingleSelectInputUI
}
