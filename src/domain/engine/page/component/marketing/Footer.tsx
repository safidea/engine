import type React from 'react'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Link } from '../base/Link'

export interface Props extends BaseProps {
  Title: React.FC
  Paragraph: React.FC
  copyright: string
  Links: React.FC[]
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

  render = async () => {
    const { title, paragraph, links, copyright, Component } = this.params
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Links = await Promise.all(links.map((link) => link.render()))
    return (props?: Partial<Props>) => (
      <Component {...{ Title, Paragraph, Links, copyright, ...props }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
