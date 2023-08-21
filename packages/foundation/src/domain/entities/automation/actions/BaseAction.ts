export type ActionType = 'log' | 'update_record' | 'create_file'

export class BaseAction {
  constructor(private _type: ActionType) {}

  get type(): ActionType {
    return this._type
  }

  getValueFromPath(obj: unknown, path: string): unknown {
    const parts = path.split('.')
    for (const part of parts) {
      if (obj && typeof obj === 'object' && part in obj) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        obj = obj[part]
      } else {
        return undefined
      }
    }
    return obj
  }
}
