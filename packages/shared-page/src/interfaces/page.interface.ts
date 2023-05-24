import type { ObjectInterface } from 'shared-common'
import type { ComponentsInterface } from 'shared-component'

export interface MetadataInterface extends ObjectInterface {
  description?: string
}

export interface PageInterface extends ObjectInterface {
  title: string
  metadata?: MetadataInterface
  components: ComponentsInterface
}

export interface PagesInterface extends ObjectInterface {
  [key: string]: PageInterface
}
