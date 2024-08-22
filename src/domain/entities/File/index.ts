import { Persisted, type Data as PersistedData, type Params as PersistedParams } from './Persisted'
import { ToSave, type Data as ToSaveData, type Params as ToCreateParams } from './ToSave'

export type FileParams = ToCreateParams & PersistedParams

export class File {
  constructor(private _params: FileParams) {}

  toSave = (data: Omit<ToSaveData, 'id' | 'created_at'>) => {
    return new ToSave(data, this._params)
  }

  persisted = (data: PersistedData) => {
    return new Persisted(data, this._params)
  }
}
