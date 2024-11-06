import {
  WebhookCalled,
  type Config,
  type Services,
} from '@domain/entities/Trigger/http/WebhookCalled'

export class WebhookCalledMapper {
  static toEntity = (config: Config, services: Services): WebhookCalled => {
    return new WebhookCalled(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): WebhookCalled[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
