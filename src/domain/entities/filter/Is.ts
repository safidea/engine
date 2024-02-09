import { Base, type BaseProps } from './base'

type IsProps = BaseProps & {
  value: string
}

export class Is extends Base {
  readonly value: string

  constructor(props: IsProps) {
    super(props)
    this.value = props.value
  }
}
