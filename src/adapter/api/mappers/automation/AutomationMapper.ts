import { Automation } from '@domain/entities/automation/Automation'
import {
  AutomationError,
  type AutomationErrorCode,
} from '@domain/entities/automation/AutomationError'
import { Services } from '@domain/services'
import type { SchemaValidatorErrorDto } from '@adapter/spi/dtos/SchemaValidatorErrorDto'
import type { Automation as AutomationConfig } from '../../configs/automation/Automation'
import type { Mapper } from '../Mapper'
import type { Logger } from '@domain/services/Logger'
import { ActionMapper } from './ActionMapper'
import { TriggerMapper } from './TriggerMapper'
import type { Server } from '@domain/services/Server'
import type { Queue } from '@domain/services/Queue'

export interface Params {
  newLogger: (location: string) => Logger
  server: Server
  queue: Queue
}

export const AutomationMapper: Mapper<AutomationConfig, AutomationError, Automation, Params> =
  class AutomationMapper {
    static toEntity = (config: AutomationConfig, params: Params) => {
      const { name } = config
      const { newLogger, server, queue } = params
      const logger = newLogger(`automation:${config.name}`)
      const trigger = TriggerMapper.toEntity(config.trigger, { server, queue, automation: name })
      const actions = ActionMapper.toManyEntities(config.actions)
      return new Automation({ name, trigger, actions, logger, queue })
    }

    static toManyEntities = (configs: AutomationConfig[], params: Params) => {
      return configs.map((config) => this.toEntity(config, params))
    }

    static toEntityFromServices = (config: AutomationConfig, services: Services) => {
      const newLogger = (location: string) => services.logger({ location })
      const server = services.server({
        logger: newLogger(`server`),
      })
      const queue = services.queue({
        logger: newLogger(`queue`),
        url: ':memory:',
        database: 'sqlite',
      })
      return this.toEntity(config, { newLogger, server, queue })
    }

    static toManyEntitiesFromServices = (configs: AutomationConfig[], services: Services) => {
      return configs.map((config) => this.toEntityFromServices(config, services))
    }

    static toErrorEntity = (errorDto: SchemaValidatorErrorDto) => {
      const { instancePath, keyword, params } = errorDto
      if (keyword === 'required') {
        if (params.missingProperty === 'name') return new AutomationError('NAME_REQUIRED')
        if (params.missingProperty === 'fields') return new AutomationError('FIELDS_REQUIRED')
      } else if (keyword === 'additionalProperties') {
        return new AutomationError('UNKNOWN_PROPERTY', { property: params.additionalProperty })
      } else if (keyword === 'type') {
        if (instancePath === '/name') return new AutomationError('NAME_STRING_TYPE_REQUIRED')
      }
      return new AutomationError('UNKNOWN_SCHEMA_ERROR')
    }

    static toManyErrorEntities = (errorDtos: SchemaValidatorErrorDto[]) => {
      return errorDtos.map(this.toErrorEntity)
    }

    static toErrorEntityFromCode = (code: AutomationErrorCode) => {
      return new AutomationError(code)
    }
  }
