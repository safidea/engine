import type { ReactComponent, Base, BaseProps } from './base'
import type { Client } from '@domain/services/Client'

export interface Props extends BaseProps {
  label: string
  href?: string
  variant?: 'primary' | 'secondary'
  clientProps?: { [key: string]: string }
}

interface Params {
  label: string
  href?: string
  variant?: 'primary' | 'secondary'
  component: ReactComponent<Props>
  client: Client
}

export class Button implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { label, href, variant, component: Component, client } = this.params
    const clientProps = client.getLinkProps()
    return (props?: Partial<Props>) => (
      <Component {...{ label, href, variant, ...props, clientProps }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
