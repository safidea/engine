export type BaseProps = {
  path: string
  baseUrl: string
  query: { [key: string]: string }
  params: { [key: string]: string }
}

export class Base {
  constructor(private props: BaseProps) {}

  get path() {
    return this.props.path
  }

  get baseUrl() {
    return this.props.baseUrl
  }
}
