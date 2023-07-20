export class BaseFilter {
  constructor(
    private readonly _field: string,
    private readonly _operator: string
  ) {}

  get field(): string {
    return this._field
  }

  get operator(): string {
    return this._operator
  }
}
