import type React from 'react'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Link } from '../base/Link'
import type { Props as TitleProps } from '../base/Title'
import type { Props as ParagraphProps } from '../base/Paragraph'
import type { Props as LinkProps } from '../base/Link'
import type { State } from '../../State'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Paragraph: React.FC<Partial<ParagraphProps>>
  copyright: string
  Links: React.FC<Partial<LinkProps>>[]
}

export interface Params {
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
    const { title, paragraph, links, copyright, Component } = this.params
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Links = await Promise.all(links.map((link) => link.render(state)))
    return (props?: Partial<Props>) => (
      <Component {...{ Title, Paragraph, Links, copyright, ...props }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
