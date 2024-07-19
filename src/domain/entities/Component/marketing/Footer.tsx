import type React from 'react'
import type { ReactComponent, Base, BaseProps } from '../base/base'
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

export interface Params extends BaseProps {
  title: Title
  paragraph: Paragraph
  links: Link[]
  copyright: string
  Component: ReactComponent<Props>
}

export class Footer implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {
    const { title, paragraph, links } = this.params
    await Promise.all([title.init(), paragraph.init(), ...links.map((link) => link.init())])
  }

  render = async (state: State) => {
    const { id, className, title, paragraph, links, copyright, Component } = this.params
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Links = await Promise.all(links.map((link) => link.render(state)))
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Paragraph, Links, copyright, ...props }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
