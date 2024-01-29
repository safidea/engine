import type { Drivers } from '@domain/drivers'
import type { IServerInstance } from '@domain/drivers/server/IServer'

export interface ITableParams {
  drivers: Drivers
  featureName: string
  serverInstance: IServerInstance
}
