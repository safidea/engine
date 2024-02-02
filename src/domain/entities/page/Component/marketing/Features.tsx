import type { Icon } from '../Icon'
import type { ReactComponent, Base } from '../base'

export interface FeaturesProps {
  title: string
  description: string
  features: {
    title: string
    description: string
    icon: Icon
  }[]
}

export type FeaturesConfig = FeaturesProps

export interface FeaturesParams {
  component: ReactComponent<FeaturesProps>
}

export class Features implements Base {
  constructor(
    private config: FeaturesConfig,
    private params: FeaturesParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
