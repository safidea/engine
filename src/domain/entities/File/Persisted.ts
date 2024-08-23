import type { Server } from '@domain/services/Server'
import type { Data as ToSaveData } from './ToSave'

export type Data = ToSaveData

export interface Params {
  server: Server
}

export class Persisted {
  constructor(
    public data: Data,
    private _params: Params
  ) {}

  get id(): string {
    return this.data.id
  }

  getFilePath(): string {
    const baseUrl = this._params.server.baseUrl
    return baseUrl + '/api/storage/' + this.data.id
  }
}
