import { Base, type BaseProps } from './base'

type IsProps = BaseProps & {
  value: string | number | boolean | Date
}

export class Is extends Base {
  readonly value: string | number | boolean | Date

  constructor(props: IsProps) {
    super(props)
    this.value = props.value
  }
}
