import {
  WebhookCalledHttpTrigger,
  type WebhookCalledHttpTriggerConfig,
  type WebhookCalledHttpTriggerServices,
} from '@domain/entities/Trigger/http/WebhookCalled'

export class WebhookCalledHttpTriggerMapper {
  static toEntity = (
    config: WebhookCalledHttpTriggerConfig,
    services: WebhookCalledHttpTriggerServices
  ): WebhookCalledHttpTrigger => {
    return new WebhookCalledHttpTrigger(config, services)
  }

  static toManyEntities = (
    configs: WebhookCalledHttpTriggerConfig[],
    services: WebhookCalledHttpTriggerServices
  ): WebhookCalledHttpTrigger[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
