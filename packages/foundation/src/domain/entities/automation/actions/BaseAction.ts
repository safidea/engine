export class BaseAction {
  constructor(private _type: string) {}

  get type(): string {
    return this._type
  }
}
