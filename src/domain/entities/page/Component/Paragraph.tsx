import type { ReactComponent, Base } from './base'

export interface Props {
  text: string
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Paragraph implements Base {
  constructor(private params: Params) {}

  render = () => <this.params.component {...this.params.props} />
}
