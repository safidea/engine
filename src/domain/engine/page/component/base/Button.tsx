import type { Ui } from '@domain/services/Ui'
import type { ReactComponent, Base, BaseProps } from './base'

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
  ui: Ui
}

export class Button implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { label, href, variant, component: Component, ui } = this.params
    const clientProps = ui.getClientLinkProps()
    return (props?: Partial<Props>) => (
      <Component {...{ label, href, variant, ...props, clientProps }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
