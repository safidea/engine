import type { ReactComponent, Base, BaseProps } from './base'
import type { Client } from '@domain/services/Client'

export type Variant = 'primary' | 'secondary'
export type Type = 'button' | 'submit' | 'reset'

export interface Props extends BaseProps {
  label: string
  href?: string
  type?: Type
  variant?: Variant
  clientProps?: { [key: string]: string }
}

interface Params {
  label: string
  href?: string
  type?: Type
  variant?: Variant
  Component: ReactComponent<Props>
  client: Client
}

export class Button implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { label, href, variant, Component, client } = this.params
    const clientProps = client.getLinkProps()
    return (props?: Partial<Props>) => (
      <Component {...{ label, href, variant, ...props, clientProps }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
