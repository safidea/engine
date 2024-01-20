import { PageList } from '../page/PageList'
import { SpecList } from '../spec/SpecList'
import type { IFeature } from './IFeature'

export class FeatureEntity {
  specs: SpecList
  pages: PageList

  constructor(public config: IFeature) {
    this.specs = new SpecList(config.specs)
    this.pages = new PageList(config.pages)
  }
}
