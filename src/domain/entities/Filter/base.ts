export type BaseProps = {
  field: string
}

export class Base {
  readonly field: string

  constructor({ field }: Base) {
    this.field = field
  }
}
