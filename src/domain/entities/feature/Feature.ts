import type { IServerInstance } from '@domain/drivers/IServer'
import type { EngineError } from '../EngineError'
import type { IEntity } from '../IEntity'
import { PageList } from '../page/PageList'
import { SpecList } from '../spec/SpecList'
import { FeatureError } from './FeatureError'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'
import type { SpecError } from '../spec/SpecError'

export class Feature implements IEntity {
  name: string
  private specs: SpecList
  private pages: PageList
  private server: IServerInstance

  constructor(
    private config: IFeature,
    private params: IFeatureParams
  ) {
    const { drivers, components } = params
    this.name = config.name
    this.server = drivers.server.create({ withPort: false })
    this.specs = new SpecList(config.specs ?? [], { drivers })
    this.pages = new PageList(config.pages ?? [], { components, server: this.server, drivers })
  }

  validateConfig() {
    const errors: EngineError[] = []
    const { roles } = this.params
    const { role } = this.config
    if (role && !roles.includes(role)) {
      errors.push(
        new FeatureError('ROLE_NOT_FOUND', {
          feature: this.config.name,
          role,
        })
      )
    }
    errors.push(...this.specs.validateConfig())
    errors.push(...this.pages.validateConfig())
    return errors
  }

  async testSpecs(): Promise<SpecError[]> {
    const url = await this.server.start()
    const errors = await this.specs.test(this.name, url)
    await this.server.stop()
    return errors
  }
}
