export type Format =
  | 'text'
  | 'number'
  | 'currency'
  | 'datetime'
  | 'boolean'
  | 'recordId'
  | 'recordsIds'

export interface FieldPermissions {
  update?:
    | boolean
    | {
        formula: string
      }
}

export class BaseField {
  constructor(
    private readonly _name: string,
    private readonly _type: string,
    private readonly _optional: boolean = false,
    private readonly _format: Format = 'text',
    private readonly _default: string | number | boolean | undefined = undefined,
    private readonly _permissions: FieldPermissions = {
      update: true,
    }
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

  get default(): string | number | boolean | undefined {
    return this._default
  }

  get permissions(): FieldPermissions {
    return this._permissions
  }
}
