import type { Server } from '@domain/services/Server'
import type { Data as ToCreatedData } from './ToSave'

export interface Data extends Omit<ToCreatedData, 'filePath'> {
  binary_data: Buffer
}

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
