import type { IServerMapper } from '@domain/mappers/IServerMapper'
import type { IServerDriver } from '../drivers/IServerDriver'

export class ServerMapper implements IServerMapper {
  constructor(private driver: IServerDriver) {}
}
