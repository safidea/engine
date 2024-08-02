export type BaseConfig = {
  field: string
}

export type BaseParams = {
  field: string
}

export class Base {
  readonly field: string

  constructor({ field }: Base) {
    this.field = field
  }
}
