import type { BaseComponent, Base } from './base'

export interface ButtonProps {
  label: string
  href?: string
  variant?: 'primary' | 'secondary'
}

export type ButtonConfig = ButtonProps

export interface ButtonParams {
  component: BaseComponent<ButtonProps>
}

export class Button implements Base {
  constructor(
    private config: ButtonConfig,
    private params: ButtonParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
