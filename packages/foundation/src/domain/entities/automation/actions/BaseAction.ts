export type ActionType = 'log' | 'update_record' | 'create_file'

export interface ContextDataAction {
  [key: string]: string | number | boolean | undefined | string[]
}

export interface ContextAction {
  [key: string]: ContextDataAction
}
export class BaseAction {
  constructor(private _type: ActionType) {}

  get type(): ActionType {
    return this._type
  }
}
