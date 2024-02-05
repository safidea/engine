import type { ReactComponent, Base } from './base'

export interface Props {
  label: string
  href?: string
  variant?: 'primary' | 'secondary'
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Button implements Base {
  constructor(private params: Params) {}

  render = () => <this.params.component {...this.params.props} />
}
