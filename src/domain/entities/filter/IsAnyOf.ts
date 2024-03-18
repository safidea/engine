import { Base, type BaseProps } from './base'

type IsAnyOfProps = BaseProps & {
  value: string[]
}

export class IsAnyOf extends Base {
  readonly value: string[]

  constructor(props: IsAnyOfProps) {
    super(props)
    this.value = props.value
  }
}
