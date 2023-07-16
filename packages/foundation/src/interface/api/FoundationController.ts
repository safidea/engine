import { GetFoundationPage } from '@application//usecases/GetFoundationPage'
import { RequestFoundationRoute } from '@application//usecases/RequestFoundationRoute'
import { FoundationRepository } from '@infrastructure/repositories/FoundationRepository'
import { ReactElement } from 'react'
export class FoundationController {
  private getFoundationPage: GetFoundationPage
  private requestFoundationRoute: RequestFoundationRoute

  constructor() {
    const foundationRepository = new FoundationRepository()
    this.getFoundationPage = new GetFoundationPage(foundationRepository)
    this.requestFoundationRoute = new RequestFoundationRoute(foundationRepository)
  }

  async page(path: string): Promise<ReactElement> {
    return this.getFoundationPage.execute(path)
  }

  async route(): Promise<any> {
    return this.requestFoundationRoute.execute()
  }
}
