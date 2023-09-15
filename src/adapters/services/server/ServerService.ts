import { App } from '@entities/app/App'
import { IServerDriver } from './IServerDriver'

export class ServerService {
  constructor(readonly driver: IServerDriver) {}

  async start(app: App): Promise<void> {
    return this.driver.start()
  }
}
