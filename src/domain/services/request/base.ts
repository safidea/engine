export type BaseProps = {
  path: string
  query: { [key: string]: string }
  params: { [key: string]: string }
}

export class Base {
  constructor(private props: BaseProps) {}
}
