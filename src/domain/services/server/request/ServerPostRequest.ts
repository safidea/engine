import { ServerBaseRequest } from './ServerBaseRequest'

export class ServerPostRequest extends ServerBaseRequest {
  public body: unknown

  constructor(props: { body: unknown }) {
    super()
    this.body = props.body
  }
}
