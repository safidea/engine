import type { Method } from '@domain/entities/request'
import type { ReactComponent, Base, BaseProps } from './base'
import type { Client } from '@domain/services/Client'
import type { State } from '../../State'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Template } from '@domain/services/Template'

export type Variant = 'primary' | 'secondary'
export type Type = 'button' | 'submit' | 'reset'

export interface Props extends BaseProps {
  label: string
  href?: string
  type?: Type
  variant?: Variant
  clientProps?: { [key: string]: string }
  action?: string
  method?: Method
  formId?: string
}

interface Params {
  label: string
  href?: string
  type?: Type
  variant?: Variant
  action?: string
  method?: Method
  Component: ReactComponent<Props>
  templateCompiler: TemplateCompiler
  client: Client
}

export class Button implements Base<Props> {
  private action?: Template

  constructor(private params: Params) {
    const { action, templateCompiler } = params
    if (action) this.action = templateCompiler.compile(action)
  }

  init = async () => {}

  render = async (state: State) => {
    const { label, href, variant, method, Component, client } = this.params
    const clientProps = client.getLinkProps()
    const action = this.action ? state.fillTemplate(this.action) : undefined
    return (props?: Partial<Props>) => (
      <Component {...{ label, href, variant, action, method, ...props, clientProps }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
