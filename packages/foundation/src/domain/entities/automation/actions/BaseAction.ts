export type ActionType = 'log' | 'update_record' | 'create_file'
export class BaseAction {
  constructor(private _type: ActionType) {}

  get type(): ActionType {
    return this._type
  }
}
