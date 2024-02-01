import { Base, type BaseProps } from './base'

export class Post extends Base {
  public body: unknown

  constructor(props: { body: unknown } & BaseProps) {
    super(props)
    this.body = props.body
  }
}
