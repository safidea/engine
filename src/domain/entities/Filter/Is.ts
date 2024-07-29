import { Base, type BaseProps } from './base'

type IsProps = BaseProps & {
  value: string | number
}

export class Is extends Base {
  readonly value: string | number

  constructor(props: IsProps) {
    super(props)
    this.value = props.value
  }
}
