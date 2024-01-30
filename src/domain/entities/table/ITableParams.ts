import type { Drivers } from '@domain/drivers'
import type { IDatabaseInstance } from '@domain/drivers/IDatabase'
import type { IServerInstance } from '@domain/drivers/server/IServer'
import type { IEntityParams } from '../IEntityParams'

export interface ITableParams extends IEntityParams {
  // TODO: to remove
  drivers: Drivers
  featureName: string
  serverInstance: IServerInstance
  databaseInstance: IDatabaseInstance
}
