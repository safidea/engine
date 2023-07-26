import { IUIRepository } from '@domain/repositories/IUIRepository'
import LinkUI from './LinkUI'
import ParagraphUI from './ParagraphUI'
import TitleUI from './TitleUI'
import NavigationUI from './NavigationUI'
import ListUI from './ListUI'

export const UnstyledUI: IUIRepository = { LinkUI, ParagraphUI, TitleUI, NavigationUI, ListUI }
