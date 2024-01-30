import type { RoleList } from '../role/RoleList'
import type { ISpecParamsShared } from '../spec/ISpecParams'
import type { IPageParamsShared } from '../page/IPageParams'
import type { IServerInstance } from '@domain/drivers/server/IServer'
import type { IEntityParams } from '../IEntityParams'

export interface IFeatureParams extends IPageParamsShared, ISpecParamsShared, IEntityParams {
  serverInstance?: IServerInstance
  roles: RoleList
}
