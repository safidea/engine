import type { IServerInstance } from '@domain/drivers/IServer'
import type { EngineError } from '../EngineError'
import type { IEntity } from '../IEntity'
import { PageList } from '../page/PageList'
import { SpecList } from '../spec/SpecList'
import { FeatureError } from './FeatureError'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'

export class Feature implements IEntity {
  name: string
  private specs: SpecList
  private pages: PageList
  private server: IServerInstance

  constructor(
    private config: IFeature,
    private params: IFeatureParams
  ) {
    this.name = config.name
    const { drivers, components } = params
    this.server = drivers.server.create()
    this.specs = new SpecList(config.specs, { drivers })
    this.pages = new PageList(config.pages ?? [], { components, server: this.server, drivers })
  }

  validateConfig() {
    const errors: EngineError[] = []
    const { roles } = this.params
    const { story } = this.config
    if (!roles.includes(story.asRole)) {
      errors.push(
        new FeatureError('STORY_AS_ROLE_NOT_FOUND', {
          feature: this.config.name,
          role: story.asRole,
        })
      )
    }
    errors.push(...this.specs.validateConfig())
    errors.push(...this.pages.validateConfig())
    return errors
  }

  async testSpecs(): Promise<EngineError[]> {
    const url = await this.server.start()
    const errors = await this.specs.test(this.name, url)
    await this.server.stop()
    return errors
  }
}
