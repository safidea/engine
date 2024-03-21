import type { Base } from './base/base'

export type Props = {
  [key: string]: string | number | undefined
}

export type CustomizedComponents = {
  [key: string]: (props: Props) => JSX.Element
}

interface Params {
  customRef: string
  customized: CustomizedComponents
  props?: Props
}

export class Customized implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { customized, customRef, props = {} } = this.params
    const Component = customized[customRef]
    return () => <Component {...props} />
  }

  validateConfig = () => {
    return []
  }
}
