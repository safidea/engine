import { Resource } from './resource.type'

export type Config = {
  resources: {
    [key: string]: Resource
  }
}
