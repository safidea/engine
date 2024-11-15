interface HeadMetaParams {
  name: string
  content: string
}

export class HeadMeta {
  constructor(private _params: HeadMetaParams) {}

  render = () => {
    return <meta name={this._params.name} content={this._params.content} />
  }

  get name() {
    return this._params.name
  }
}
