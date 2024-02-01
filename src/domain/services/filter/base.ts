export type BaseFilterProps = {
  field: string
}

export class BaseFilter {
  readonly field: string

  constructor({ field }: BaseFilter) {
    this.field = field
  }
}
