import type { Base, BaseProps, BaseServices } from '../base'
import type { Title } from '../content/Title'
import type { Paragraph } from '../content/Paragraph'
import type { Link } from '../content/Link'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as LinkProps } from '../content/Link'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Paragraph: React.FC<Partial<ParagraphProps>>
  copyright: string
  Links: React.FC<Partial<LinkProps>>[]
}

export interface Config extends BaseProps {
  copyright: string
}

export type Services = BaseServices

export interface Entities extends BaseProps {
  title: Title
  paragraph: Paragraph
  links: Link[]
}

export class Footer implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { title, paragraph, links } = this._entities
    await Promise.all([title.init(), paragraph.init(), ...links.map((link) => link.init())])
  }

  render = async (state: State) => {
    const { title, paragraph, links } = this._entities
    const { id, className, copyright } = this._config
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Links = await Promise.all(links.map((link) => link.render(state)))
    const Component = this._services.client.components.Footer
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Paragraph, Links, copyright, ...props }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
