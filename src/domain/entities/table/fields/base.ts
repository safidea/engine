export interface BaseFieldProps {
  name: string
}

export class BaseField {
  readonly name: string

  constructor({ name }: BaseFieldProps) {
    this.name = name
  }
}
