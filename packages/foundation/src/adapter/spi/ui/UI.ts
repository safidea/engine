import { FormUI } from '@domain/entities/page/ui/FormUI'
import { LinkUI } from '@domain/entities/page/ui/LinkUI'
import { ListUI } from '@domain/entities/page/ui/ListUI'
import { NavigationUI } from '@domain/entities/page/ui/NavigationUI'
import { ParagraphUI } from '@domain/entities/page/ui/ParagraphUI'
import { TitleUI } from '@domain/entities/page/ui/TitleUI'
import { TableInputUI } from '@domain/entities/page/ui/inputs/TableInputUI'
import { TextInputUI } from '@domain/entities/page/ui/inputs/TextInputUI'

export interface UI {
  LinkUI: LinkUI
  ParagraphUI: ParagraphUI
  TitleUI: TitleUI
  NavigationUI: NavigationUI
  ListUI: ListUI
  FormUI: FormUI
  TextInputUI: TextInputUI
  TableInputUI: TableInputUI
}
