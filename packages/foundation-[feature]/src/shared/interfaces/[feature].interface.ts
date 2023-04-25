import type { ObjectInterface } from 'foundation-common'

export interface FeatureInterface extends ObjectInterface {
  key: string
}

export interface FeaturesInterface extends ObjectInterface {
  [key: string]: FeatureInterface
}
