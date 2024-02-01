import { BaseRequest } from './base'

export class PostRequest extends BaseRequest {
  public body: unknown

  constructor(props: { body: unknown }) {
    super()
    this.body = props.body
  }
}
