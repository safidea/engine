import type { Base, BaseProps } from './base/base'

export interface Props extends BaseProps {}

interface Params extends Props {
  customRef: string
  customized: { [key: string]: React.FC }
}

export class Customized implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { customized, customRef } = this.params
    const Component = customized[customRef]
    return () => <Component />
  }

  validateConfig = () => {
    return []
  }
}
