export type Format = 'text' | 'number' | 'currency' | 'boolean' | 'recordId' | 'recordsIds'

export class BaseField {
  constructor(
    private readonly _name: string,
    private readonly _type: string,
    private readonly _optional: boolean = false,
    private readonly _format: Format = 'text'
  ) {}

  get name(): string {
    return this._name
  }

  get type(): string {
    return this._type
  }

  get optional(): boolean {
    return this._optional
  }

  get format(): Format {
    return this._format
  }
}
