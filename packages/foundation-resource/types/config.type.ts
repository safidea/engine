import { Resource } from './resource.type'

export type Resources = {
  [key: string]: Resource
}

export type Config = {
  resources: Resources
}
