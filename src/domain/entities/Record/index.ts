import { Persisted, type Data as PersistedData } from './Persisted'
import { ToCreate, type Data as ToCreateData, type Params as ToCreateParams } from './ToCreate'
import { ToUpdate, type Data as ToUpdateData } from './ToUpdate'

export type RecordParams = ToCreateParams

export class Record {
  constructor(private _params: RecordParams) {}

  toCreate = (data: Partial<ToCreateData>) => {
    return new ToCreate(data, this._params)
  }

  toUpdate = (data: Pick<ToUpdateData, 'id'> & Partial<ToUpdateData>) => {
    return new ToUpdate(data)
  }

  persisted = (data: PersistedData) => {
    return new Persisted(data)
  }
}
