import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { GetAppPage } from '@application/usecases/GetAppPage'
import { RequestAppRoute } from '@application/usecases/RequestAppRoute'
import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { AppDto } from '@application/dtos/AppDto'
import { ResponseDto } from '@application/dtos/ResponseDto'
import { ReactElement } from 'react'

export class AppController {
  private appConfig: AppDto | undefined
  private getAppPage: GetAppPage
  private requestAppRoute: RequestAppRoute
  private configureApp: ConfigureApp

  constructor() {
    const appRepository = new AppRepository()
    this.configureApp = new ConfigureApp(appRepository)
    this.getAppPage = new GetAppPage(appRepository)
    this.requestAppRoute = new RequestAppRoute(appRepository)
  }

  async configure(): Promise<AppDto> {
    return this.configureApp.execute()
  }

  async getPage(path: string): Promise<ReactElement> {
    if (!this.appConfig) this.appConfig = await this.configure()
    return this.getAppPage.execute(path, this.appConfig)
  }

  async requestRoute(): Promise<ResponseDto> {
    if (!this.appConfig) this.appConfig = await this.configure()
    return this.requestAppRoute.execute()
  }
}
