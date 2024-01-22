import type { ConfigError } from '../ConfigError'
import { PageList } from '../page/PageList'
import { SpecError } from '../spec/SpecError'
import { SpecList } from '../spec/SpecList'
import { FeatureError } from './FeatureError'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'

export class Feature {
  errors: ConfigError[] = []
  specs: SpecList
  pages: PageList

  constructor(
    public config: IFeature,
    params: IFeatureParams
  ) {
    this.validateFeatureConfig(params)
    this.specs = new SpecList(config.specs)
    this.pages = new PageList(config.pages, { components: params.components })
    if (this.pages.errors.length) {
      this.errors = this.pages.errors
    }
  }

  validateFeatureConfig(params: IFeatureParams) {
    const { roles } = params
    const { story } = this.config
    if (!roles.includes(story.asRole)) {
      this.errors.push(
        new FeatureError('STORY_AS_ROLE_NOT_FOUND', {
          feature: this.config.name,
          role: story.asRole,
        })
      )
    }
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
