import { IServerRequest } from './IServerRequest'

export type IServerHandler = (
  request: IServerRequest
) => Promise<{ status?: number; json?: unknown; html?: string }>
