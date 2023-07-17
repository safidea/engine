import { HtmlProps } from '@domain/components/IHtmlProps'

export interface IComponentsRepository {
  get(name: string): React.FC<HtmlProps>
}
