import { IFoundationRepository } from '@domain/repositories/IFoundationRepository'

export class RequestFoundationRoute {
  constructor(private foundationRepository: IFoundationRepository) {}

  async execute(): Promise<any> {
    return this.foundationRepository.route()
  }
}
