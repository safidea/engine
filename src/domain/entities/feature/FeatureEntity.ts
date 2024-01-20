import { PageList } from '../page/PageList'
import { SpecList } from '../spec/SpecList'
import { FeatureError } from './FeatureError'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'

export class FeatureEntity {
  errors: FeatureError[] = []
  specs: SpecList
  pages: PageList

  constructor(
    public config: IFeature,
    params: IFeatureParams
  ) {
    this.validateFeatureConfig(params)
    this.specs = new SpecList(config.specs)
    this.pages = new PageList(config.pages, { components: params.components })
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
}
