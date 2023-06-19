import type { ObjectInterface } from 'shared-common'
import type { ComponentInterface } from 'shared-component'

export interface MetadataInterface extends ObjectInterface {
  description?: string
}

export type PagesComponentInterface = ComponentInterface & {
  components?: PagesComponentsInterface
}

export type PagesComponentsInterface = PagesComponentInterface[]

export interface PageInterface extends ObjectInterface {
  title: string
  metadata?: MetadataInterface
  components: PagesComponentsInterface
}

export interface PagesInterface extends ObjectInterface {
  [key: string]: PageInterface
}
