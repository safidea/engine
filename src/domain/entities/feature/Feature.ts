import type { ConfigError } from '../ConfigError'
import type { IEntity } from '../IEntity'
import { PageList } from '../page/PageList'
import { SpecError } from '../spec/SpecError'
import { SpecList } from '../spec/SpecList'
import { FeatureError } from './FeatureError'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'

export class Feature implements IEntity {
  name: string
  private specs: SpecList
  private pages: PageList

  constructor(
    private config: IFeature,
    private params: IFeatureParams
  ) {
    this.name = config.name
    this.specs = new SpecList(config.specs)
    this.pages = new PageList(config.pages, { components: params.components })
  }

  validateConfig() {
    const errors: ConfigError[] = []
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

  async testSpecs(): Promise<ConfigError[]> {
    const { name, specs: [spec] = [] } = this.config
    if ('text' in spec.then[0]) {
      return [
        new SpecError('TEXT_NOT_FOUND', {
          feature: name,
          spec: spec.name,
          text: spec.then[0].text,
        }),
      ]
    }
    return []
  }
}
