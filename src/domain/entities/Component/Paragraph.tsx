import type { ReactComponent, Base } from './base'

export interface ParagraphProps {
  text: string
}

export type ParagraphConfig = ParagraphProps

export interface ParagraphParams {
  component: ReactComponent<ParagraphProps>
}

export class Paragraph implements Base {
  constructor(
    private config: ParagraphConfig,
    private params: ParagraphParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
